// Tranh + câu giới thiệu viết tay cho các thể loại đã có art; thể loại mới thì chưa có (null).
const TAGLINES: Record<string, string> = {
  "tien-hiep": "Tu luyện thành tiên, cầu đạo trường sinh giữa núi mây kỳ ảo.",
  "kiem-hiep": "Giang hồ hiệp nghĩa, kiếm khí tung hoành, ân oán phân minh.",
  "ngon-tinh": "Những chuyện tình ngọt ngào, day dứt, khiến tim lỡ một nhịp.",
  "do-thi": "Nhịp sống thành phố hiện đại, nơi người thường làm nên chuyện lớn.",
  "trinh-tham": "Lần theo từng dấu vết, giải những vụ án ly kỳ tới trang cuối.",
  "huyen-huyen": "Thế giới huyền bí với thần thú, phép thuật và sức mạnh vô biên.",
  "khoa-huyen": "Du hành vũ trụ, công nghệ tương lai và những thế giới chưa ai tới.",
  "tam-ly": "Những câu chuyện chậm rãi, lắng sâu vào lòng người.",
  "gia-dinh": "Ấm áp, đời thường, những gắn bó không gì thay thế.",
  "lich-su": "Ngược dòng thời gian, sống lại những triều đại đã qua.",
};

export type GenreInfo = { tagline: string; art: string; thumb: string };

export function genreInfo(slug: string): GenreInfo | null {
  if (!Object.hasOwn(TAGLINES, slug)) return null;
  return { tagline: TAGLINES[slug], art: `/art/genres/${slug}.webp`, thumb: `/art/genres/${slug}-sm.webp` };
}
