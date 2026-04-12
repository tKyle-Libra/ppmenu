#!/usr/bin/env node

/**
 * 从 Excel 价目表提取商品图片
 *
 * 功能：
 *   1. 解析 Excel 中嵌入的图片（通过 DISPIMG 公式关联）
 *   2. 按 Sheet 分类保存到对应目录
 *   3. 自动生成缩略图到 thumbnail 子目录
 *   4. 统一转换为 JPEG 格式
 *
 * 依赖：
 *   pip3 install openpyxl Pillow
 *
 * 使用方法：
 *   python3 scripts/extract-images.js
 *
 * 配置：
 *   修改下方 CONFIG 对象中的参数
 */

const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

const CONFIG = {
  excelPath: path.resolve(__dirname, '../../价目表.xlsx'),
  outputBase: path.resolve(__dirname, '../../../ppmenu_assets_test'),
  thumbnailSize: 300,
  jpegQuality: 90,
  thumbnailQuality: 80,
  sheetDirMap: {
    '酱包': 'jb',
    '餐包': 'cb',
    '罐头': 'gt',
    '餐盒': 'ch',
    '奶制品': 'nzp',
    '汤': 'tang',
    '主食冻干': 'dg',
    '零食冻干': 'dg',
    '其他': 'other',
    '猫条': 'mt',
  },
}

const PYTHON_SCRIPT = `
import zipfile
import xml.etree.ElementTree as ET
import openpyxl
import re
import os
from io import BytesIO
from PIL import Image
import json
import sys

def main():
    excel_path = sys.argv[1]
    output_base = sys.argv[2]
    thumb_size = int(sys.argv[3])
    jpeg_quality = int(sys.argv[4])
    thumb_quality = int(sys.argv[5])
    sheet_dir_map = json.loads(sys.argv[6])

    # Step 1: Build DISPIMG_ID -> media_file mapping
    z = zipfile.ZipFile(excel_path)

    rels_content = z.read('xl/_rels/cellimages.xml.rels')
    rels_root = ET.fromstring(rels_content)
    rid_map = {}
    for rel in rels_root:
        rid_map[rel.get('Id')] = 'xl/' + rel.get('Target').replace('../', '')

    ci_content = z.read('xl/cellimages.xml')
    ci_root = ET.fromstring(ci_content)

    ns1 = '{http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing}'
    ns2 = '{http://schemas.openxmlformats.org/drawingml/2006/main}'
    ns3 = '{http://schemas.openxmlformats.org/officeDocument/2006/relationships}'

    id_to_media = {}
    for cellImg in ci_root:
        pic = cellImg.find(f'{ns1}pic')
        if pic is None:
            continue
        nvPicPr = pic.find(f'{ns1}nvPicPr')
        cNvPr = nvPicPr.find(f'{ns1}cNvPr') if nvPicPr is not None else None
        if cNvPr is None:
            continue
        img_id = cNvPr.get('name', '')
        blipFill = pic.find(f'{ns1}blipFill')
        blip = blipFill.find(f'{ns2}blip') if blipFill is not None else None
        if blip is None:
            continue
        rid = blip.get(f'{ns3}embed', '')
        media_file = rid_map.get(rid, '')
        if img_id and media_file:
            id_to_media[img_id] = media_file

    print(f'[1/4] 解析到 {len(id_to_media)} 个图片映射')

    # Step 2: Read each sheet, extract data
    wb = openpyxl.load_workbook(excel_path, data_only=False)

    total_extracted = 0
    total_thumbs = 0
    errors = []
    stats = {}

    for sheet_name in wb.sheetnames:
        if sheet_name == 'WpsReserved_CellImgList':
            continue

        dir_name = sheet_dir_map.get(sheet_name, 'other')
        out_dir = os.path.join(output_base, dir_name)
        thumb_dir = os.path.join(out_dir, 'thumbnail')
        os.makedirs(out_dir, exist_ok=True)
        os.makedirs(thumb_dir, exist_ok=True)

        ws = wb[sheet_name]
        sheet_count = 0

        for row in ws.iter_rows(min_row=1, max_row=ws.max_row, min_col=1, max_col=6):
            cell_a = row[0]
            cell_f = row[5] if len(row) > 5 else None

            if not cell_a.value or not isinstance(cell_a.value, str) or 'DISPIMG' not in cell_a.value:
                continue

            match = re.search(r'DISPIMG\\("([^"]+)"', cell_a.value)
            if not match:
                continue
            dispimg_id = match.group(1)

            if cell_f is None or cell_f.value is None or str(cell_f.value).strip() == '':
                continue
            filename = str(cell_f.value).strip()

            media_path = id_to_media.get(dispimg_id)
            if media_path is None:
                errors.append(f'[{sheet_name}] 未找到图片: {dispimg_id}')
                continue

            try:
                img_data = z.read(media_path)
                out_path = os.path.join(out_dir, filename + '.jpeg')

                img = Image.open(BytesIO(img_data))
                if img.mode in ('RGBA', 'P', 'LA'):
                    rgb = Image.new('RGB', img.size, (255, 255, 255))
                    if img.mode == 'P':
                        img = img.convert('RGBA')
                    rgb.paste(img, mask=img.split()[-1] if 'A' in img.mode else None)
                    img = rgb
                elif img.mode != 'RGB':
                    img = img.convert('RGB')

                img.save(out_path, 'JPEG', quality=jpeg_quality)

                thumb_path = os.path.join(thumb_dir, filename + '.jpeg')
                thumb = img.copy()
                thumb.thumbnail((thumb_size, thumb_size), Image.LANCZOS)
                thumb.save(thumb_path, 'JPEG', quality=thumb_quality)

                sheet_count += 1
            except Exception as e:
                errors.append(f'[{sheet_name}] {filename}: {e}')

        if sheet_count > 0:
            stats[sheet_name] = {'dir': dir_name, 'count': sheet_count}
            print(f'  [{sheet_name}] -> {dir_name}/ ({sheet_count} 张)')
            total_extracted += sheet_count

    z.close()
    wb.close()

    print()
    print(f'[完成] 共提取 {total_extracted} 张图片 (原图 + 缩略图)')
    if errors:
        print(f'[警告] {len(errors)} 个错误:')
        for e in errors[:10]:
            print(f'  {e}')
        if len(errors) > 10:
            print(f'  ... 还有 {len(errors) - 10} 个')

main()
`

function run() {
  const config = CONFIG

  console.log('=== Excel 图片提取工具 ===')
  console.log()
  console.log('Excel 文件:', config.excelPath)
  console.log('输出目录:', config.outputBase)
  console.log('缩略图尺寸:', config.thumbnailSize + 'px')
  console.log()

  if (!fs.existsSync(config.excelPath)) {
    console.error('错误: Excel 文件不存在:', config.excelPath)
    process.exit(1)
  }

  const sheetMapJson = JSON.stringify(config.sheetDirMap)

  const tmpScript = path.join(__dirname, '.extract-images-tmp.py')
  fs.writeFileSync(tmpScript, PYTHON_SCRIPT, 'utf-8')

  try {
    execSync(
      `python3 "${tmpScript}" "${config.excelPath}" "${config.outputBase}" ${config.thumbnailSize} ${config.jpegQuality} ${config.thumbnailQuality} '${sheetMapJson}'`,
      { stdio: 'inherit', cwd: __dirname }
    )
  } finally {
    fs.unlinkSync(tmpScript)
  }
}

run()
