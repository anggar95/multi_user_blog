import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { prisma } from '../../../../../lib/prisma';

export async function POST(req: Request) {
  try {
    const { postId } = await req.json();
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            name: true
          }
        }
      }
    });

    if (!post) {
      return new NextResponse('Post not found', { status: 404 });
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            h1 {
              font-size: 2em;
              margin-bottom: 0.5em;
            }
            .meta {
              color: #666;
              margin-bottom: 2em;
            }
          </style>
        </head>
        <body>
          <h1>${post.title}</h1>
          <div class="meta">
            By ${post.author.name || 'Anonymous'} on ${new Date(post.createdAt).toLocaleDateString()}
          </div>
          <div class="content">
            ${post.content}
          </div>
        </body>
      </html>
    `;

    await page.setContent(html);
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px',
      },
    });

    await browser.close();

    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${post.title.toLowerCase().replace(/\s+/g, '-')}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 