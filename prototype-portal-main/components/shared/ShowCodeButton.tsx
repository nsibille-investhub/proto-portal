'use client';
import { useState } from 'react';
import { Button, Drawer } from 'antd';
import { CodeOutlined } from '@ant-design/icons';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ShowCodeButtonProps {
  title: string;
  code: string;
}

export function ShowCodeButton({ title, code }: ShowCodeButtonProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        icon={<CodeOutlined />}
        size="small"
        onClick={() => setOpen(true)}
        style={{ position: 'absolute', top: 8, right: 8, zIndex: 10, fontSize: 12 }}
      >
        Show code
      </Button>
      <Drawer
        title={`Code — ${title}`}
        open={open}
        onClose={() => setOpen(false)}
        width={680}
      >
        <SyntaxHighlighter language="tsx" style={oneLight} customStyle={{ fontSize: 12.5, borderRadius: 8 }}>
          {code}
        </SyntaxHighlighter>
      </Drawer>
    </>
  );
}
