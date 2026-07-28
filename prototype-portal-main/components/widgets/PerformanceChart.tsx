'use client';
import { useMemo } from 'react';
import { LinePath } from '@visx/shape';
import { scaleLinear, scalePoint } from '@visx/scale';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import { useTooltip, TooltipWithBounds, defaultStyles } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { bisector } from 'd3-array';
import { ParentSize } from '@visx/responsive';
import { curveMonotoneX } from '@visx/curve';

interface DataPoint {
  date: string;
  nav: number;
}

interface ChartInnerProps {
  data: DataPoint[];
  width: number;
  height: number;
}

const margin = { top: 20, right: 20, bottom: 40, left: 55 };

function ChartInner({ data, width, height }: ChartInnerProps) {
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } = useTooltip<DataPoint>();

  const xScale = useMemo(() =>
    scalePoint<string>({
      domain: data.map(d => d.date),
      range: [0, innerWidth],
      padding: 0.1,
    }), [data, innerWidth]);

  const navValues = data.map(d => d.nav);
  const minNav = Math.min(...navValues);
  const maxNav = Math.max(...navValues);

  const yScale = useMemo(() =>
    scaleLinear<number>({
      domain: [Math.max(0, minNav - 10), maxNav + 10],
      range: [innerHeight, 0],
      nice: true,
    }), [minNav, maxNav, innerHeight]);

  // Show every 4th month as label
  const tickValues = data.filter((_, i) => i % 4 === 0).map(d => d.date);

  const bisectDate = bisector<DataPoint, string>(d => d.date).left;

  const handleMouseMove = (event: React.MouseEvent<SVGRectElement>) => {
    const { x } = localPoint(event) || { x: 0 };
    const xPos = x - margin.left;
    // Find the closest data point
    const step = innerWidth / (data.length - 1);
    const idx = Math.round(xPos / step);
    const clampedIdx = Math.max(0, Math.min(data.length - 1, idx));
    const d = data[clampedIdx];
    if (!d) return;
    const xVal = xScale(d.date) ?? 0;
    const yVal = yScale(d.nav);
    showTooltip({
      tooltipData: d,
      tooltipLeft: xVal + margin.left,
      tooltipTop: yVal + margin.top,
    });
  };

  if (width < 10) return null;

  return (
    <div style={{ position: 'relative' }}>
      <svg width={width} height={height}>
        <defs>
          <linearGradient id="navGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0E2A32" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#0E2A32" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Group left={margin.left} top={margin.top}>
          <GridRows
            scale={yScale}
            width={innerWidth}
            strokeDasharray="4,4"
            stroke="#E5E7EB"
            numTicks={5}
          />

          {/* Area fill */}
          <path
            d={(() => {
              const points = data.map(d => `${xScale(d.date) ?? 0},${yScale(d.nav)}`);
              const last = data[data.length - 1];
              const first = data[0];
              return `M${xScale(first.date) ?? 0},${innerHeight} ` +
                `L${points.join(' L')} ` +
                `L${xScale(last.date) ?? 0},${innerHeight} Z`;
            })()}
            fill="url(#navGradient)"
          />

          <LinePath
            data={data}
            x={d => xScale(d.date) ?? 0}
            y={d => yScale(d.nav)}
            stroke="#0E2A32"
            strokeWidth={2.5}
            curve={curveMonotoneX}
          />

          <AxisBottom
            top={innerHeight}
            scale={xScale}
            tickValues={tickValues}
            tickFormat={v => {
              const [year, month] = v.split('-');
              return `${month}/${year.slice(2)}`;
            }}
            stroke="#E5E7EB"
            tickStroke="transparent"
            tickLabelProps={{ fill: '#6B7280', fontSize: 11, textAnchor: 'middle', dy: '0.25em' }}
          />

          <AxisLeft
            scale={yScale}
            numTicks={5}
            stroke="#E5E7EB"
            tickStroke="transparent"
            tickLabelProps={{ fill: '#6B7280', fontSize: 11, textAnchor: 'end', dx: '-0.3em', dy: '0.25em' }}
            tickFormat={v => `${v}`}
          />

          {tooltipOpen && tooltipData && (
            <circle
              cx={xScale(tooltipData.date) ?? 0}
              cy={yScale(tooltipData.nav)}
              r={5}
              fill="#0E2A32"
              stroke="white"
              strokeWidth={2}
              style={{ pointerEvents: 'none' }}
            />
          )}

          {/* Transparent overlay for mouse events */}
          <rect
            width={innerWidth}
            height={innerHeight}
            fill="transparent"
            onMouseMove={handleMouseMove}
            onMouseLeave={hideTooltip}
          />
        </Group>
      </svg>

      {tooltipOpen && tooltipData && (
        <TooltipWithBounds
          top={tooltipTop}
          left={tooltipLeft}
          style={{
            ...defaultStyles,
            background: '#0E2A32',
            color: 'white',
            borderRadius: 6,
            fontSize: 12,
            padding: '6px 10px',
          }}
        >
          <div style={{ fontWeight: 600 }}>{tooltipData.date}</div>
          <div>NAV : {tooltipData.nav}</div>
        </TooltipWithBounds>
      )}
    </div>
  );
}

interface PerformanceChartProps {
  data: DataPoint[];
  height?: number;
}

export function PerformanceChart({ data, height = 280 }: PerformanceChartProps) {
  return (
    <ParentSize>
      {({ width }) => <ChartInner data={data} width={width} height={height} />}
    </ParentSize>
  );
}
