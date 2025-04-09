import i18n from '@dhis2/d2-i18n'
import { Button, ButtonStrip, Card, IconChevronDown24, IconDelete16, IconEdit16, InputFieldFF } from '@dhis2/ui'
import React, { ReactNode } from 'react'
import { Field, useField, useForm, useFormState } from 'react-final-form'
import { useFieldArray } from 'react-final-form-arrays'
import { ModelSingleSelect, ModelSingleSelectFormField } from '../../../components/metadataFormControls/ModelSingleSelect'
import { CategoriesSelector } from './CategoriesSelector'
// import { ModelSingleSelectFormField } from '../../../components/metadataFormControls/ModelSingleSelect'
import { generateDhis2Id } from '../../../lib'
import css from './DissaggregationCategories.module.css'



export const DisaggregationCategories = () => {
    const categories = Object.keys(
        useFormState().initialValues.categoryMappings
    )
    return (
        <div>
            <CategoriesSelector />
            {categories.map((id) => (
                <DisaggregationCategory key={id} id={id} />
            ))}
        </div>
    )
}

export const DisaggregationCategory = ({ id }: { id: string }) => {
    const array = useFieldArray(`categoryMappings.${id}`)
    const formApi = useForm()
    return (
        <div className={css.categoryCard}>
            <div className={css.categoryHeader}>
                <div className={css.categoryTitleContainer}>
                    <IconChevronDown24 />
                    <span className={css.categoryText}>{i18n.t('Category: ')}</span>
                    <span className={css.categoryName}>{id}</span>
                </div>
                <Button small secondary destructive>{i18n.t('Remove')}</Button>
            </div>
            {array.fields.map((fieldName, index) => {
                return (
                    <div key={fieldName}>
                        <CategoryMapping fieldName={fieldName} />
                    </div>
                )
            })}
                        <Button
                            small
                            onClick={() => {
                                array.fields.push({
                                    categoryId: id,
                                    id: generateDhis2Id(),
                                    mappingName: 'A new mapping',
                                    options: {
                                        // tbd
                                    },
                                    deleted: false,
                                })
                            }}
                        >
                            {i18n.t('Add mapping')}
                        </Button>            
        </div>
    )
}

const CategoryMappingWrapper = ({children}:{children:ReactNode})=>{
    return (
        <Card className={css.mappingCard}>
            {children}
        </Card>
    )
}

type CategoryMappingProps = {
    fieldName: string
}
export const CategoryMapping = ({ fieldName }: CategoryMappingProps) => {
    const formApi = useForm()
    const categoryMapping = useField(fieldName)
    if (categoryMapping.input.value.deleted) {
        return (
            <CategoryMappingWrapper>
                Soft deleted
                <Button
                    small
                    onClick={() => {
                        formApi.change(fieldName, {
                            ...categoryMapping.input.value,
                            deleted: false,
                        })
                    }}
                >
                    Undo
                </Button>
            </CategoryMappingWrapper>
        )
    }
    return (
        <CategoryMappingWrapper>
            <div className={css.mappingHeader}>
                <div className={css.mappingText}>
                    <span>{i18n.t('Mapping: ')}</span>
                    <span>{categoryMapping.input.value.mappingName}</span>
            
                </div>

            <ButtonStrip>
            <Button
                icon={<IconEdit16 />}
                small
                onClick={() => {
                }}
            ></Button>            
            <Button
                icon={<IconDelete16 />}
                small
                onClick={() => {
                    formApi.change(fieldName, {
                        ...categoryMapping.input.value,
                        deleted: true,
                    })
                }}
            >
            </Button>    
            </ButtonStrip>        
            </div>
            {Object.keys(categoryMapping.input.value.options).map((opt) => (
                <div className={css.filterInputContainer}>
                    <Field
                        name={`${fieldName}.options.${opt}.filter`}
                        key={`${fieldName}.options.${opt}.filter`}
                        label={`filter ${opt}`}
                        component={InputFieldFF}
                    />
                </div>
            ))}
        </CategoryMappingWrapper>
    )
}
