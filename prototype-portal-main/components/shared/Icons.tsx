export function DocumentIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M7 21L17 21C18.6569 21 20 19.6569 20 18V8.37167C20 7.57602 19.6839 6.81296 19.1213 6.25035L16.7497 3.87868C16.187 3.31607 15.424 3 14.6283 3L7 3C5.34315 3 4 4.34315 4 6L4 18C4 19.6569 5.34315 21 7 21Z" stroke="#001D4A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 17H8" stroke="#001D4A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 13.5L8 13.5" stroke="#001D4A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11 10H8" stroke="#001D4A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 8.5H16.5C15.3954 8.5 14.5 7.60457 14.5 6.5V3" stroke="#001D4A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function FolderIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M7.52793 3.25C8.50445 3.25 9.4024 3.76724 9.89466 4.59956L9.98761 4.77016L10.382 5.559L10.7764 4.77016C11.2131 3.89673 12.0773 3.3249 13.0419 3.25684L13.2361 3.25L19 3.25C20.4625 3.25 21.6584 4.3917 21.745 5.83248L21.75 6L21.75 18C21.75 19.4625 20.6083 20.6584 19.1675 20.745L19 20.75L5 20.75C3.53747 20.75 2.3416 19.6083 2.25502 18.1675L2.25 18L2.25 6C2.25 4.53747 3.3917 3.3416 4.83248 3.25502L5 3.25L7.52793 3.25ZM7.52793 4.75L5 4.75C4.35279 4.75 3.82047 5.24187 3.75645 5.87219L3.75 6L3.75 18C3.75 18.6472 4.24187 19.1795 4.87219 19.2435L5 19.25L19 19.25C19.6472 19.25 20.1795 18.7581 20.2435 18.1278L20.25 18L20.25 8.75L11.382 8.75C10.7701 8.74998 10.2068 8.43087 9.89057 7.91548L9.81679 7.78262L8.64597 5.44098C8.4554 5.05985 8.08575 4.80506 7.66857 4.75791L7.52793 4.75ZM19 4.75L19.1278 4.75645L19.2519 4.7754C19.8215 4.89195 20.25 5.39594 20.25 6V7.25L11.382 7.25L11.3265 7.24376C11.3085 7.23965 11.2911 7.23359 11.2746 7.22574L11.236 7.202L12.118 5.44098L12.188 5.31873C12.4167 4.96668 12.8099 4.75 13.2361 4.75L19 4.75Z" fill="#001D4A"/>
    </svg>
  );
}
