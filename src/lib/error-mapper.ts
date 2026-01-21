export const errorMapper = (error: string | undefined) => {
    if (error === 'Invalid password') {
        return 'Trenutna lozinka nije ispravna'
    }
    if (error === 'Invalid email or password') {
        return 'Neispravna email adresa ili lozinka'
    }
    return error
}