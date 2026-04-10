import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://iruoprliorbncswzfyfl.supabase.co'
const supabaseAnonKey = 'sb_publishable_2NDWz1-o-YIHdL8bSIEO6Q_NP7IoLm1'

console.log('Testing connection to:', supabaseUrl)

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function test() {
    try {
        const { data, error } = await supabase
            .from('blogs')
            .select('*')

        if (error) {
            console.error('Supabase Error Details:', JSON.stringify(error, null, 2))
        } else {
            console.log('Success! Found', data.length, 'blogs.')
            if (data.length > 0) {
                console.log('Data sample:', data[0])
            }
        }
    } catch (err) {
        console.error('Unexpected Catch Error:', err)
    }
}

test()
