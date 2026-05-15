import { pool } from './pool'

const testConnection = async () => {
    try {
        const result = await pool.query('SELECT NOW()')

        console.log('PostgreSQL connected successfully')
        console.log(result.rows[0])
    } catch (error) {
        console.error('PostgreSQL connection error:', error)
    } finally {
        await pool.end()
    }
}

testConnection()