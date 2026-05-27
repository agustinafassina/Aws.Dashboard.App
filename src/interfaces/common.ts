import React from 'react'

export interface IIcons {
  width?: number
  height?: number
  fill?: string | any
  stroke?: string | any
  strokeWidth?: number
  lineWidth?: number
  position?: string
}

export interface Column<T> {
  key: keyof T
  label: string
  render?: (value: any, row: T) => React.ReactNode
  className?: string
  width?: string
}

export interface Tab {
  label: string
  icon?: React.ReactNode
  tooltip?: string
  component: React.ReactNode
}

export interface IField {
  type: string
  name?: string
  value?: string | number | boolean
  options?: any[]
  defaultValue?: string
  className?: string
  colSpan?: string
  component?: React.ReactNode
  data?: any[]
}

export enum ESectionType {
  TABLE = 'table',
  MULTIPLE = 'multiple',
  TEXT = 'text-area',
}

export interface ISection {
  label: string
  type?: ESectionType
  rows: IRow[]
}

export interface IRow {
  id: string
  fields: IField[]
}
export interface IDataSheetField {
  id?: number
  type: 'file' | 'text' | 'email' | 'number' | 'link'
  name: string
  label: string
  readOnly?: boolean
  showEdit?: boolean
  value?: string | number | null
  linkLabel?: string | null
  className?: string
}
