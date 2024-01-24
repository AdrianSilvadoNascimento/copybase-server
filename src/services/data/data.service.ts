import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { parse } from 'csv-parse';

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

  async readCsv(data: Buffer) {
    const rows = await this.parseCsv(data.toString());

    let totalValue = 0;
    let churnCount = 0;

    rows.forEach((row, index) => {
      if (index > 0) {
        const potentialMRR = parseFloat(row[6].replace(',', '.'));
        totalValue += potentialMRR;
      }

      const status = row[3];
      churnCount += this.calculateChurnRate(status);
    });

    const averageMRR = totalValue / rows.length;
    const churnRate = churnCount / rows.length;

    return {
      mrr: averageMRR,
      churnRate,
      headers: rows[0],
      values: this.getValuesFromRows(rows),
    };
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
      churnCount += this.calculateChurnRate(status);
    });

    const averageMRR = totalValue / rows.length;
    const churnRate = churnCount / rows.length;

    return {
      mrr: averageMRR,
      churnRate,
      headers: rows[0],
      values: this.getValuesFromRows(rows),
    };
  }

  private parseCsv(csvString: string): Promise<string[][]> {
    return new Promise((resolve, reject) => {
      parse(csvString, { columns: false }, (err, output) => {
        if (err) {
          reject(err);
        } else {
          resolve(output);
        }
      });
    });
  }

  private getValuesFromRows(rows) {
    return rows.map((row, index) => {
      if (index > 0) {
        return Object.values(row);
      }
    });
  }

  private calculateChurnRate(status: string): number {
    const statusLower = status.toLowerCase();
    return statusLower === 'cancelada' ||
      statusLower === 'trial cancelado' ||
      statusLower === 'cancelado'
      ? 1
      : 0;
  }
}
