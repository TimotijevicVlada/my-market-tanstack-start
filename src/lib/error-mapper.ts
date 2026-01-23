export const errorMapper = (error: string | undefined) => {
    if (error === 'Invalid password') {
        return 'Trenutna lozinka nije ispravna'
    }
    if (error === 'Invalid email or password') {
        return 'Neispravna email adresa ili lozinka'
    }
    if (error === 'You can\'t unlink your last account') {
        return 'Ne možete prekinuti vezu sa vašim poslednjim nalogom'
    }
    if (error === 'Credential account not found') {
        return 'Nemate odobrenu prijavu lozinkom. Postavite vašu lozinku u sekciji ispod.'
    }
    return error
}