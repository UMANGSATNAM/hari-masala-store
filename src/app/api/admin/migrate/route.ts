import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const key = searchParams.get('key')
  
  if (key !== 'harimasala123') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const nodePath = process.execPath
    // Run the migration script which now handles table creation and data migration
    const { stdout, stderr } = await execAsync(`"${nodePath}" scripts/migrate.js`)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database synced and data migrated successfully!',
      stdout, 
      stderr 
    })
  } catch (error: any) {
    console.error('Migration error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message, 
      stdout: error.stdout, 
      stderr: error.stderr 
    }, { status: 500 })
  }
}
