import { Module } from '@nestjs/common';

import { LeadModule } from './modules/lead.module';


@Module({
  imports: [LeadModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
