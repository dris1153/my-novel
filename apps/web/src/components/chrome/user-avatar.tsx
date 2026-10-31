import Image from "next/image";

/** Ảnh Google; chữ cái đầu nằm dưới ảnh nên ảnh lỗi/hết hạn vẫn còn thứ để hiện. */
export function UserAvatar({ name, image }: { name: string; image?: string | null }) {
  return (
    <span
      aria-hidden
      className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-accent-soft font-bold text-accent-fg">
      {name.charAt(0).toUpperCase()}
      {image && (
        // Google chặn ảnh avatar nếu có Referer; `/_next/image` cũng không cần thiết cho ảnh 40px.
        <Image src={image} alt="" fill sizes="40px" unoptimized referrerPolicy="no-referrer" className="object-cover" />
      )}
    </span>
  );
}
