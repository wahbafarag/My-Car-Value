import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './reports.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from '../users/user.entity';
import { GetEstimatetDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private reportsRepository: Repository<Report>,
  ) {}

  async create(body: CreateReportDto, user: User) {
    const report = this.reportsRepository.create(body);
    report.user = user;
    return await this.reportsRepository.save(report);
  }

  async changeApproval(id: number, approved: boolean) {
    const report = await this.reportsRepository.findOne({ where: { id: id } });
    if (!report) throw new NotFoundException('Report not found');
    report.approved = approved;
    return await this.reportsRepository.save(report);
  }

  async getEstimate(estimateDto: GetEstimatetDto) {
    const { make, model, lng, lat, year, milage } = estimateDto;
    return this.reportsRepository
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('approved IS TRUE')
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .orderBy('ABS(milage - :milage)', 'DESC')
      .setParameters({ milage })
      .limit(3)
      .getRawOne();
  }
}
