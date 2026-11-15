import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: false,
    }),
  );

  // Swagger (siempre activo en dev)
  const config = new DocumentBuilder()
    .setTitle('Task Manager API')
    .setDescription('API REST para gestionar tareas y responsables')
    .setVersion('1.0.0')
    .addTag('tasks')
    .addTag('assignees')
    .build();
  const document = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    jsonDocumentUrl: '/api/docs/json',
    swaggerOptions: {
      docExpansion: 'none',
      filter: true,
    },
    customSiteTitle: 'Task Manager API Docs',
    customJsStr: `
      setTimeout(() => {
        const topbar = document.querySelector('.topbar-wrapper');
        if (topbar) {
          const link = document.createElement('a');
          link.href = '/api/docs/json';
          link.target = '_blank';
          link.textContent = 'JSON';
          link.style.cssText = 'color:#fff;margin-left:auto;margin-right:20px;font-size:14px;text-decoration:underline;align-self:center;';
          topbar.parentElement.appendChild(link);
        }
      }, 500);
    `,
  });

  // Redirect raíz /api -> /api/docs
  app.use((req: any, res: any, next: any) => {
    if (req.originalUrl === '/api' || req.originalUrl === '/api/') {
      res.redirect(301, '/api/docs');
    } else {
      next();
    }
  });

  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3000);
  const url = await app.getUrl();
  console.log(`\n🚀 Backend Task Manager running at: ${url}`);
  console.log(`📚 Swagger UI: ${url}/api/docs`);
  console.log(`📄 Swagger JSON: ${url}/api/docs/json\n`);
}
bootstrap();
