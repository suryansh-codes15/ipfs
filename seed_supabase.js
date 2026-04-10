import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const supabaseUrl = 'https://iruoprliorbncswzfyfl.supabase.co'
const supabaseAnonKey = 'sb_publishable_2NDWz1-o-YIHdL8bSIEO6Q_NP7IoLm1'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function seed() {
    const blogs = JSON.parse(fs.readFileSync('blogs_data.json', 'utf-8'))

    console.log(`Starting seed of ${blogs.length} blogs...`)

    // First, clear existing data to avoid duplicates if re-running
    const { error: deleteError } = await supabase
        .from('blogs')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // delete all

    if (deleteError) {
        console.error('Error clearing old data:', deleteError)
        // Continue anyway as it might be a new table
    }

    const { data, error } = await supabase
        .from('blogs')
        .insert(blogs)
        .select()

    if (error) {
        console.error('Error seeding data:', error)
    } else {
        console.log('Successfully seeded database with', data.length, 'blogs!')
    }
}

seed()
