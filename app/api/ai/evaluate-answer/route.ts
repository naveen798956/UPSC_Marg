import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { userContent, marks = 15 } = await req.json();
  const words = userContent.trim().split(/\s+/).filter(Boolean).length;
  const hasKeywords = /(article\s\d+|kesavananda|basic\sstructure|bommai)/i.test(userContent);
  const score = hasKeywords ? 11 : 7;
  return NextResponse.json({
    success: true,
    wordCount: words,
    totalMarks: marks,
    awardedScore: score,
    percentage: Math.round((score / marks) * 100),
    evaluationBand: score >= 10 ? 'High Standard (UPSC Selection Range)' : 'Needs Deeper Citations'
  });
}