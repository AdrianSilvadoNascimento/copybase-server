import { Injectable } from '@nestjs/common';
import { FileReader } from 'file-reader';
import * as XLSX from 'xlsx';

@Injectable()
export class DataService {
  constructor() {}

  async getData(file: File) {
    console.log(FileReader);
    const reader = FileReader;
    reader.onload = async () => {
      const data = await reader.reasult;

      if (
        data.type ===
        'application/vnd.openxmlformats-officedocument.speadsheetml.sheet'
      ) {
        return this.readCsv(data);
      } else {
        return this.readXlsx(data);
      }
    };

    reader.readAsArrayBuffer(file);
  }

  async readCsv(data: ArrayBuffer) {
    const rows = new TextDecoder().decode(data);
    const a = rows[0];
    const b = rows[1];
    console.log(a, b);
    // const mrr = rows.reduce((acc, value) => acc + value, 0);
    // const churnRate =
    //   rows.reduce((acc, value) => acc + (value === 0 ? 1 : 0), 0) / rows.length;
    // return { mrr, churnRate };
  }

  async readXlsx(data: ArrayBuffer) {
    const workbook = XLSX.read(data, { type: 'array' });
    console.log(typeof workbook.Sheets.length);
    const sheet = workbook.Sheets[0];
    const rows = sheet.data.reduce((acc, row) => [...acc, ...row], []);
    const mrr = rows.reduce((acc, value) => acc + value[0], 0);
    const churnRate =
      rows.reduce((acc, value) => acc + (value[1] === 0 ? 1 : 0), 0) /
      rows.length;

    console.log(mrr, churnRate);

    return { mrr, churnRate };
  }
}
