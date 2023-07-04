const CODE_PATTERN = /^[a-zA-Z]{1}[a-zA-Z0-9]{10}$/

export const isValidUid = (uid: string | undefined): boolean => {
    if (!uid) {
        return false
    }
    return CODE_PATTERN.test(uid)
}
