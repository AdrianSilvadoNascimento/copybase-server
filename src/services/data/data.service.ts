import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as XLSX from 'xlsx';

@Injectable()
export class DataService {
  constructor() {}

  async getData(file: Buffer) {
    if (file.length === 0) {
      throw new Error('O arquivo está vazio');
    }

    if (file.toString('hex', 0, 4) === '504b0304') {
      return this.readXlsx(file);
    } else {
      return this.readCsv(file);
    }
  }

  async readFile(filePath: string): Promise<ArrayBuffer> {
    const data = await fs.readFile(filePath);
    return data.buffer;
  }

  async readCsv(data: Buffer) {
    const rows = data.toString().split('\n');

    let totalValue = 0;
    let churnCount = 0;

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i].split(',');
      const value = parseFloat(row[0]);

      totalValue += value;
      churnCount += parseFloat(row[1]) === 0 ? 1 : 0;
    }

    const mrr = totalValue / (rows.length - 1);
    const churnRate = churnCount / (rows.length - 1);

    return { mrr, churnRate };
  }

  async readXlsx(data: Buffer) {
    const workbook = XLSX.read(data, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    let totalValue = 0;
    let churnCount = 0;

    rows.forEach((row) => {
      const potentialMRR = parseFloat(row['valor']);
      const mrr = potentialMRR;

      const status = row['status'];

      totalValue += mrr;
      churnCount += status.toLowerCase() === 'inativa' ? 1 : 0;
    });

    const averageMRR = totalValue / rows.length;
    const churnRate = churnCount / rows.length;

    return { mrr: averageMRR, churnRate };
  }
}
