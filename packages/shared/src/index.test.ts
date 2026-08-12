import { test } from 'node:test';
import assert from 'node:assert/strict';
import { slugify, splitChapters, countWords } from './helpers.ts';

test('slugify xử lý được dấu tiếng Việt và chữ đ', () => {
  assert.equal(slugify('Người Gác Đèn Biển'), 'nguoi-gac-den-bien');
  assert.equal(slugify('Kiếm Động Cửu Thiên'), 'kiem-dong-cuu-thien');
  assert.equal(slugify('  Lối Về — Mùa Hạ!  '), 'loi-ve-mua-ha');
  assert.equal(slugify('Đường Đến Đỉnh Đồi'), 'duong-den-dinh-doi');
});

test('splitChapters tách theo tiêu đề chương', () => {
  const raw = [
    'Lời tựa bị bỏ qua.',
    'Chương 1: Khởi đầu',
    'Nội dung một.',
    'CHƯƠNG 2 - Ngọn hải đăng',
    'Nội dung hai.',
    'Chuong 3',
    'Nội dung ba.',
  ].join('\n');

  const out = splitChapters(raw);
  assert.equal(out.length, 3);
  assert.deepEqual(
    out.map((c) => c.number),
    [1, 2, 3]
  );
  assert.equal(out[0].title, 'Khởi đầu');
  assert.equal(out[1].title, 'Ngọn hải đăng');
  assert.equal(out[0].content, 'Nội dung một.');
  // Không có tên -> tự đặt theo số chương
  assert.equal(out[2].title, 'Chương 3');
  // Chương cuối chạy tới hết file
  assert.equal(out[2].content, 'Nội dung ba.');
});

test('splitChapters trả mảng rỗng khi không tìm thấy chương', () => {
  assert.deepEqual(splitChapters('Chỉ là văn bản thường.'), []);
});

test('countWords', () => {
  assert.equal(countWords('  '), 0);
  assert.equal(countWords('Gió từ phía biển thổi lên'), 6);
});
