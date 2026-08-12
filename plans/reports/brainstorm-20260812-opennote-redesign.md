# Brainstorm — Redesign UI theo Opennote

Ngày: 2026-08-12 · Trạng thái: đã duyệt hướng (demo: docs/wireframe/opennote.html)

## Vấn đề

Áp design system "Opennote" (DESIGN.md — sổ tay giấy ấm, serif/sans, sepia + ink-violet,
no-shadow, hairline) lên project app đọc truyện.

## Đánh giá độ khớp

App hiện tại đã ~80% cùng tinh thần (giấy ấm, serif+sans, hairline, no-shadow). Đây là
**re-tokenization**, không phải redesign từ đầu.

## Quyết định (đã chốt)

| Câu hỏi | Chốt |
|---|---|
| Phạm vi | Chrome (home, chi tiết, tìm kiếm, tủ truyện) + toàn bộ admin. Reader giữ nguyên. |
| Dark themes | GIỮ 4 reading theme (Giấy/Ngả vàng/Đêm/OLED) + app dark mode — đọc đêm là tính năng |
| Font reader | Thân truyện giữ Literata @1.8 (tiếng Việt long-form). Chrome dùng Source Serif 4 + Inter |

## Ánh xạ Opennote → app truyện

- **Sepia #512906** = CTA duy nhất ("Đọc từ đầu", "Đăng"). Không stack 2 sepia/viewport.
- **Ink-violet #242d64** = một panel/trang → band "Đề cử tuần" thay hero sienna cũ.
- **Forest Ink #0c3b1a** = tag thể loại + trạng thái "đã đăng".
- Serif ở tiêu đề, Inter ở UI. 10px radius. Hairline #e5e5e5. Zero shadow.
- Bìa truyện = ảnh nội dung, giữ (luật "no photography" nhắm doodle marketing).

## Cố tình chệch DESIGN.md

1. Reader không light-only — giữ Đêm/OLED.
2. Thân truyện Literata @1.8, không hạ 1.5.
3. Không marginalia doodle (lạc thể loại, không asset).
4. Margin-yellow #ffc934: DESIGN.md chỉ cho làm wash sau illustration → app không có chỗ →
   BỎ khỏi hệ. Oxblood #5e0831: để dành nhãn cảnh báo (18+), chưa dùng.

## Feasibility

- Source Serif 4 + Inter: có subset tiếng Việt đầy đủ trên Google Fonts ✓
- IowanOld/SuisseIntl (brand gốc) không có license công khai → dùng substitute.

## Phạm vi kỹ thuật (2 artifact vì 2 nền tảng)

- **Mobile (RN, không NativeWind)**: dịch palette + font vào `apps/mobile/src/constants/theme.ts`
  (`Colors.light` đổi sang Opennote; `Colors.dark` + `ReadingThemes` GIỮ nguyên).
  `global.css` swap `--font-ui`/`--font-read` cho web. Font native: cài `@expo-google-fonts/
  source-serif-4` + `inter`, cập nhật `FontFamily`.
- **Admin (Next + Tailwind v4)**: `globals.css` @theme thay bằng token Opennote gần như trực tiếp.
- Các component đọc token qua biến nên đa số không phải sửa tay; chỗ hardcode màu/hero cần rà.

## Rủi ro

- Reader dùng serif KHÁC chrome (Literata vs Source Serif 4) — chấp nhận được, đã quyết.
- Font mới phải kiểm lại render tiếng Việt trên native + web export.
- Hero sienna cũ → ink-violet panel: đổi cấu trúc component home, không chỉ đổi màu.

## Success criteria

- Chrome + admin mang thẩm mỹ Opennote; reader + 4 theme + line-height 1.8 KHÔNG đổi.
- Typecheck sạch, web export vẫn build, render tiếng Việt đúng.
