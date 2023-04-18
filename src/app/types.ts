
export type ReadonlyStringObject = {
  readonly [key: string]: string
}

export type PageProps = {
  params: ReadonlyStringObject,
  searchParams: ReadonlyStringObject
}