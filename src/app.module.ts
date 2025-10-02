import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BudgetModule } from './budget/budget.module';
import { CategoryModule } from './category/category.module';
import { ContextInterceptor } from './interceptor/request-context.interceptor';
import { TransactionModule } from './transaction/transaction.module';
import { UserModule } from './users/user.module';
import { ReportModule } from './report/report.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `${configService.get('DATABASE_HOST')}`,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    CategoryModule,
    BudgetModule,
    TransactionModule,
    AuthModule,
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    ReportModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: ContextInterceptor },
  ],
})
export class AppModule {}
