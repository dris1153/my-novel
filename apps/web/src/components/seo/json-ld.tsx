/** Thẻ JSON-LD. Nội dung là object tĩnh do mình dựng, không phải input người dùng. */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
