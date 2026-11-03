import React, { ReactNode } from 'react'
import styles from '@/styles/components/Table/table.module.scss'

type TableVariant = 'default' | 'bordered' | 'minimal'
type TableSize = 'sm' | 'md' | 'lg'

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children: ReactNode
  variant?: TableVariant
  size?: TableSize
  striped?: boolean
  hoverable?: boolean
  full?: boolean
}

interface TableSectionProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode
}

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode
}

interface TableHeadProps
  extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode
}

interface TableCellProps
  extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode
}

interface TableCaptionProps
  extends React.HTMLAttributes<HTMLTableCaptionElement> {
  children: ReactNode
}

function Table({
  children,
  variant = 'default',
  size = 'md',
  striped = false,
  hoverable = false,
  full = true,
  className,
  ...props
}: TableProps) {
  const classes = [
    styles.table,
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    striped && styles.striped,
    hoverable && styles.hoverable,
    full && styles.full,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={styles.wrapper}>
      <table {...props} className={classes}>
        {children}
      </table>
    </div>
  )
}

function Header({
  children,
  className,
  ...props
}: TableSectionProps) {
  return (
    <thead
      {...props}
      className={[styles.header, className].filter(Boolean).join(' ')}
    >
      {children}
    </thead>
  )
}

function Body({
  children,
  className,
  ...props
}: TableSectionProps) {
  return (
    <tbody
      {...props}
      className={[styles.body, className].filter(Boolean).join(' ')}
    >
      {children}
    </tbody>
  )
}

function Footer({
  children,
  className,
  ...props
}: TableSectionProps) {
  return (
    <tfoot
      {...props}
      className={[styles.footer, className].filter(Boolean).join(' ')}
    >
      {children}
    </tfoot>
  )
}

function Row({
  children,
  className,
  ...props
}: TableRowProps) {
  return (
    <tr
      {...props}
      className={[styles.row, className].filter(Boolean).join(' ')}
    >
      {children}
    </tr>
  )
}

function Head({
  children,
  className,
  ...props
}: TableHeadProps) {
  return (
    <th
      {...props}
      className={[styles.head, className].filter(Boolean).join(' ')}
    >
      {children}
    </th>
  )
}

function Cell({
  children,
  className,
  ...props
}: TableCellProps) {
  return (
    <td
      {...props}
      className={[styles.cell, className].filter(Boolean).join(' ')}
    >
      {children}
    </td>
  )
}

function Caption({
  children,
  className,
  ...props
}: TableCaptionProps) {
  return (
    <caption
      {...props}
      className={[styles.caption, className].filter(Boolean).join(' ')}
    >
      {children}
    </caption>
  )
}

Table.Header = Header
Table.Body = Body
Table.Footer = Footer
Table.Row = Row
Table.Head = Head
Table.Cell = Cell
Table.Caption = Caption

export default Table