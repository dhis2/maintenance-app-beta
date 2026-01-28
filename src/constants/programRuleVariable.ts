export const PROGRAM_RULE_VARIABLE_CONSTANTS = {
    NAME_PATTERN: /^[a-zA-Z0-9\s\-._]+$/,
    FORBIDDEN_WORDS: ['and', 'or', 'not'] as const,
    MAX_NAME_LENGTH: 230,
    FIELD_WIDTH: '400px',
} as const
