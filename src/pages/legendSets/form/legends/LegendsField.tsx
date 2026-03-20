import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    DataTable,
    DataTableCell,
    DataTableColumnHeader,
    DataTableRow,
    IconChevronDown16,
    IconChevronRight16,
    IconDelete16,
    Input,
    InputField,
    Layer,
    NoticeBox,
    Popper,
    TableBody,
    TableFoot,
    TableHead,
} from '@dhis2/ui'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { SketchPicker } from 'react-color'
import { useField } from 'react-final-form'
import { generateDhis2Id } from '../../../../lib/models/uid'
import { LegendItem } from '../legendSetFormSchema'
import {
    COLOR_SCALES,
    MIN_CLASSES,
    MAX_CLASSES,
    generateLegendItems,
} from './colorScales'
import classes from './LegendsField.module.css'

const DEFAULT_COLOR = '#FFA500'
const DEFAULT_STEP = 10
const LIGHTNESS_SHIFT = -0.08

function hexToHsl(hex: string): [number, number, number] {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const l = (max + min) / 2
    if (max === min) {
        return [0, 0, l]
    }
    const d = max - min
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    let h = 0
    if (max === r) {
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
    } else if (max === g) {
        h = ((b - r) / d + 2) / 6
    } else {
        h = ((r - g) / d + 4) / 6
    }
    return [h * 360, s, l]
}

function hslToHex(h: number, s: number, l: number): string {
    const hue = ((h % 360) + 360) % 360
    const c = (1 - Math.abs(2 * l - 1)) * s
    const x = c * (1 - Math.abs(((hue / 60) % 2) - 1))
    const m = l - c / 2
    let r = 0,
        g = 0,
        b = 0
    if (hue < 60) {
        r = c
        g = x
    } else if (hue < 120) {
        r = x
        g = c
    } else if (hue < 180) {
        g = c
        b = x
    } else if (hue < 240) {
        g = x
        b = c
    } else if (hue < 300) {
        r = x
        b = c
    } else {
        r = c
        b = x
    }
    const toHex = (v: number) =>
        Math.round((v + m) * 255)
            .toString(16)
            .padStart(2, '0')
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function shiftColor(hex: string): string {
    const [h, s, l] = hexToHsl(hex)
    const newL = Math.min(0.9, Math.max(0.15, l + LIGHTNESS_SHIFT))
    return hslToHex(h, s, newL)
}

export function LegendsField() {
    const { input, meta } = useField<LegendItem[]>('legends')
    const legends: LegendItem[] = input.value || []

    const [confirmOpen, setConfirmOpen] = useState(false)
    const [generatorOpen, setGeneratorOpen] = useState(legends.length === 0)

    const [startValue, setStartValue] = useState('0')
    const [endValue, setEndValue] = useState('100')
    const [selectedScaleIndex, setSelectedScaleIndex] = useState(0)
    const [numClasses, setNumClasses] = useState(5)
    const [scalePickerOpen, setScalePickerOpen] = useState(false)
    const scaleButtonRef = useRef<HTMLButtonElement>(null)

    const selectedScale = COLOR_SCALES[selectedScaleIndex]

    const sortedLegends = useMemo(
        () => [...legends].sort((a, b) => a.startValue - b.startValue),
        [legends]
    )

    const overlappingIds = useMemo(() => {
        const ids = new Set<string>()
        for (let i = 0; i < sortedLegends.length - 1; i++) {
            const current = sortedLegends[i]
            const next = sortedLegends[i + 1]
            if (current.endValue > next.startValue) {
                ids.add(current.id)
                ids.add(next.id)
            }
        }
        return ids
    }, [sortedLegends])

    const updateItem = useCallback(
        (id: string, patch: Partial<LegendItem>) => {
            const updated = legends.map((l) =>
                l.id === id ? { ...l, ...patch } : l
            )
            input.onChange(updated)
            input.onBlur()
        },
        [legends, input]
    )

    const handleDeleteItem = useCallback(
        (id: string) => {
            input.onChange(legends.filter((l) => l.id !== id))
            input.onBlur()
        },
        [legends, input]
    )

    const handleAddItem = useCallback(() => {
        const sorted = [...legends].sort((a, b) => a.startValue - b.startValue)
        const last = sorted[sorted.length - 1]

        const newStart = last ? last.endValue : 0
        const newEnd = newStart + DEFAULT_STEP
        const newName = `${newStart} - ${newEnd}`

        const newColor = last ? shiftColor(last.color) : DEFAULT_COLOR

        const newItem: LegendItem = {
            id: generateDhis2Id(),
            name: newName,
            startValue: newStart,
            endValue: newEnd,
            color: newColor,
        }

        input.onChange([...legends, newItem])
        input.onBlur()
    }, [legends, input])

    const doGenerate = useCallback(() => {
        const start = parseFloat(startValue)
        const end = parseFloat(endValue)
        if (isNaN(start) || isNaN(end) || end <= start) {
            return
        }
        const colors = selectedScale.scale[numClasses]
        if (!colors) {
            return
        }
        const items = generateLegendItems(start, end, colors)
        input.onChange(items)
        input.onBlur()
        setConfirmOpen(false)
    }, [startValue, endValue, selectedScale, numClasses, input])

    const handleGenerate = useCallback(() => {
        if (legends.length > 0) {
            setConfirmOpen(true)
        } else {
            doGenerate()
        }
    }, [legends.length, doGenerate])

    const startNum = parseFloat(startValue)
    const endNum = parseFloat(endValue)
    const generateDisabled =
        startValue === '' ||
        endValue === '' ||
        isNaN(startNum) ||
        isNaN(endNum) ||
        endNum <= startNum

    const fieldError =
        meta.touched && meta.error && typeof meta.error === 'string'
            ? meta.error
            : undefined

    return (
        <div>
            <div className={classes.generateSection}>
                <button
                    type="button"
                    className={classes.generateToggle}
                    onClick={() => setGeneratorOpen((o) => !o)}
                >
                    <span className={classes.generateToggleIcon}>
                        {generatorOpen ? (
                            <IconChevronDown16 />
                        ) : (
                            <IconChevronRight16 />
                        )}
                    </span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        className="euiIcon eui-alignMiddle website-css-1t0rgrv-euiIcon-m-isLoaded"
                        role="presentation"
                        data-icon-type="wrench"
                        data-is-loaded="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M11.28 2.013 10 3.293V6h2.707l1.28-1.28a3 3 0 1 1-2.707-2.707Zm1.165-.744a4 4 0 0 0-5.31 4.767l-5.55 5.55a2 2 0 1 0 2.83 2.828l5.549-5.55A4.005 4.005 0 0 0 15 5c0-.509-.095-.996-.27-1.445a.5.5 0 0 0-.819-.173L12.293 5H11V3.707l1.618-1.618a.5.5 0 0 0-.173-.82ZM8.968 8.446l-5.26 5.261a1 1 0 0 1-1.415-1.414l5.26-5.261c.345.582.833 1.07 1.415 1.414Z"
                            clipRule="evenodd"
                        />
                    </svg>
                    {i18n.t('Legend generator')}
                </button>
                {generatorOpen && (
                    <div className={classes.generateBody}>
                        <div className={classes.generateInputs}>
                            <InputField
                                label={i18n.t('Start value')}
                                value={startValue}
                                type="number"
                                onChange={(e: { value?: string }) =>
                                    setStartValue(e.value ?? '')
                                }
                                inputWidth="120px"
                            />
                            <InputField
                                label={i18n.t('End value')}
                                value={endValue}
                                type="number"
                                onChange={(e: { value?: string }) =>
                                    setEndValue(e.value ?? '')
                                }
                                inputWidth="120px"
                            />
                            <InputField
                                label={i18n.t('Items')}
                                value={String(numClasses)}
                                type="number"
                                min={String(MIN_CLASSES)}
                                max={String(MAX_CLASSES)}
                                step="1"
                                onChange={(e: { value?: string }) => {
                                    const raw = e.value ?? ''
                                    if (raw === '') {
                                        return
                                    }
                                    const n = Number.parseInt(raw, 10)
                                    if (Number.isNaN(n)) {
                                        return
                                    }
                                    setNumClasses(
                                        Math.min(
                                            MAX_CLASSES,
                                            Math.max(MIN_CLASSES, n)
                                        )
                                    )
                                }}
                                inputWidth="80px"
                            />
                            <div className={classes.colorScaleSelector}>
                                <span className={classes.colorScaleLabel}>
                                    {i18n.t('Color scale')}
                                </span>
                                <button
                                    type="button"
                                    ref={scaleButtonRef}
                                    className={classes.colorScaleButton}
                                    onClick={() =>
                                        setScalePickerOpen(!scalePickerOpen)
                                    }
                                >
                                    <ColorScalePreview
                                        colors={
                                            selectedScale.scale[numClasses] ||
                                            []
                                        }
                                    />
                                    <IconChevronDown16 />
                                </button>
                                {scalePickerOpen && (
                                    <Layer
                                        onBackdropClick={() =>
                                            setScalePickerOpen(false)
                                        }
                                    >
                                        <Popper
                                            placement="bottom-start"
                                            reference={scaleButtonRef}
                                        >
                                            <div
                                                className={
                                                    classes.colorScalePopover
                                                }
                                            >
                                                {COLOR_SCALES.map(
                                                    (scaleDef, index) => (
                                                        <button
                                                            key={scaleDef.name}
                                                            type="button"
                                                            className={
                                                                classes.colorScaleOption
                                                            }
                                                            onClick={() => {
                                                                setSelectedScaleIndex(
                                                                    index
                                                                )
                                                                setScalePickerOpen(
                                                                    false
                                                                )
                                                            }}
                                                        >
                                                            <ColorScalePreview
                                                                colors={
                                                                    scaleDef
                                                                        .scale[
                                                                        numClasses
                                                                    ] || []
                                                                }
                                                            />
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        </Popper>
                                    </Layer>
                                )}
                            </div>
                        </div>
                        <Button
                            onClick={handleGenerate}
                            disabled={generateDisabled}
                        >
                            {i18n.t('Create legend items')}
                        </Button>
                    </div>
                )}
            </div>

            {confirmOpen && (
                <NoticeBox warning title={i18n.t('Replace existing items?')}>
                    <p>
                        {i18n.t('This will replace all existing legend items.')}
                    </p>
                    <ButtonStrip>
                        <Button small onClick={() => setConfirmOpen(false)}>
                            {i18n.t('Cancel')}
                        </Button>
                        <Button small destructive onClick={doGenerate}>
                            {i18n.t('Proceed')}
                        </Button>
                    </ButtonStrip>
                </NoticeBox>
            )}

            <DataTable>
                <TableHead>
                    <DataTableRow>
                        <DataTableColumnHeader />
                        <DataTableColumnHeader>
                            {i18n.t('Name')}
                        </DataTableColumnHeader>
                        <DataTableColumnHeader>
                            {i18n.t('Start value')}
                        </DataTableColumnHeader>
                        <DataTableColumnHeader>
                            {i18n.t('End value')}
                        </DataTableColumnHeader>
                        <DataTableColumnHeader />
                    </DataTableRow>
                </TableHead>
                <TableBody>
                    {sortedLegends.length === 0 && (
                        <DataTableRow>
                            <DataTableCell colSpan="5">
                                {i18n.t(
                                    'No legend items yet. Add items manually or use the generator above.'
                                )}
                            </DataTableCell>
                        </DataTableRow>
                    )}
                    {sortedLegends.map((item) => (
                        <InlineLegendItemRow
                            key={item.id}
                            item={item}
                            isOverlapping={overlappingIds.has(item.id)}
                            onUpdate={updateItem}
                            onDelete={handleDeleteItem}
                        />
                    ))}
                </TableBody>
                <TableFoot>
                    <DataTableRow>
                        <DataTableCell colSpan="5">
                            <Button small onClick={handleAddItem}>
                                {i18n.t('Add legend item')}
                            </Button>
                        </DataTableCell>
                    </DataTableRow>
                </TableFoot>
            </DataTable>

            {fieldError && (
                <div className={classes.validationError}>{fieldError}</div>
            )}
        </div>
    )
}

function InlineLegendItemRow({
    item,
    isOverlapping,
    onUpdate,
    onDelete,
}: {
    item: LegendItem
    isOverlapping: boolean
    onUpdate: (id: string, patch: Partial<LegendItem>) => void
    onDelete: (id: string) => void
}) {
    const [colorPickerOpen, setColorPickerOpen] = useState(false)
    const colorRef = useRef<HTMLButtonElement>(null)

    return (
        <DataTableRow
            className={isOverlapping ? classes.legendItemRowOverlap : ''}
        >
            <DataTableCell>
                <button
                    type="button"
                    ref={colorRef}
                    className={classes.legendItemColorButton}
                    style={{ background: item.color }}
                    onClick={() => setColorPickerOpen(!colorPickerOpen)}
                    aria-label={i18n.t('Change color')}
                />
                {colorPickerOpen && (
                    <Layer onBackdropClick={() => setColorPickerOpen(false)}>
                        <Popper placement="bottom-start" reference={colorRef}>
                            <div className={classes.inlineColorPicker}>
                                <SketchPicker
                                    color={item.color}
                                    disableAlpha
                                    onChangeComplete={({
                                        hex,
                                    }: {
                                        hex: string
                                    }) => {
                                        onUpdate(item.id, { color: hex })
                                    }}
                                />
                            </div>
                        </Popper>
                    </Layer>
                )}
            </DataTableCell>
            <DataTableCell>
                <Input
                    value={item.name}
                    onChange={(e: { value?: string }) =>
                        onUpdate(item.id, { name: e.value ?? '' })
                    }
                    dense
                />
            </DataTableCell>
            <DataTableCell>
                <Input
                    value={String(item.startValue)}
                    type="number"
                    onChange={(e: { value?: string }) => {
                        const num = parseFloat(e.value ?? '')
                        if (!isNaN(num)) {
                            onUpdate(item.id, { startValue: num })
                        }
                    }}
                    dense
                />
            </DataTableCell>
            <DataTableCell>
                <Input
                    value={String(item.endValue)}
                    type="number"
                    onChange={(e: { value?: string }) => {
                        const num = parseFloat(e.value ?? '')
                        if (!isNaN(num)) {
                            onUpdate(item.id, { endValue: num })
                        }
                    }}
                    dense
                />
            </DataTableCell>
            <DataTableCell>
                <Button
                    small
                    secondary
                    destructive
                    icon={<IconDelete16 />}
                    aria-label={i18n.t('Delete')}
                    onClick={() => onDelete(item.id)}
                />
            </DataTableCell>
        </DataTableRow>
    )
}

function ColorScalePreview({ colors }: { colors: string[] }) {
    return (
        <div className={classes.colorScalePreview}>
            {colors.map((color, i) => (
                <span
                    key={i}
                    className={classes.colorScalePreviewCell}
                    style={{ background: color }}
                />
            ))}
        </div>
    )
}
