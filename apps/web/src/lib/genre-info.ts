// Tranh + câu giới thiệu viết tay cho các thể loại đã có art; thể loại mới thì chưa có (null).
// `tint` = màu ô thể loại, lấy sắc độ từ mép dưới tranh (contrast.test.ts kiểm chữ trên nó).
export const GENRES: Record<string, { tagline: string; tint: string }> = {
  "tien-hiep": { tagline: "Tu luyện thành tiên, cầu đạo trường sinh giữa núi mây kỳ ảo.", tint: "#e7ecff" },
  "kiem-hiep": { tagline: "Giang hồ hiệp nghĩa, kiếm khí tung hoành, ân oán phân minh.", tint: "#f2e7ff" },
  "ngon-tinh": { tagline: "Những chuyện tình ngọt ngào, day dứt, khiến tim lỡ một nhịp.", tint: "#ffe3ed" },
  "do-thi": { tagline: "Nhịp sống thành phố hiện đại, nơi người thường làm nên chuyện lớn.", tint: "#ffe5d8" },
  "trinh-tham": { tagline: "Lần theo từng dấu vết, giải những vụ án ly kỳ tới trang cuối.", tint: "#daf4eb" },
  "huyen-huyen": { tagline: "Thế giới huyền bí với thần thú, phép thuật và sức mạnh vô biên.", tint: "#f1e7ff" },
  "khoa-huyen": { tagline: "Du hành vũ trụ, công nghệ tương lai và những thế giới chưa ai tới.", tint: "#dceeff" },
  "tam-ly": { tagline: "Những câu chuyện chậm rãi, lắng sâu vào lòng người.", tint: "#fceacd" },
  "gia-dinh": { tagline: "Ấm áp, đời thường, những gắn bó không gì thay thế.", tint: "#e4f3d6" },
  "lich-su": { tagline: "Ngược dòng thời gian, sống lại những triều đại đã qua.", tint: "#ffe2db" },
};

export type GenreInfo = { tagline: string; tint: string; art: string; thumb: string };

export function genreInfo(slug: string): GenreInfo | null {
  if (!Object.hasOwn(GENRES, slug)) return null;
  return { ...GENRES[slug], art: `/art/genres/${slug}.webp`, thumb: `/art/genres/${slug}-sm.webp` };
}
