export function fetched (value) {
  return ({
    isLoading: false,
    isError: false,
    value: value
  })
}

export function mapFetched (resource, func) {
  if (resource.value) {
    return ({
      ...resource,
      value: func(resource.value)
    })
  }
  return resource
}

export function loading () {
  return ({
    isLoading: true,
    isError: false,
    value: null
  })
}

export function fetchError () {
  return ({
    isLoading: false,
    isError: true,
    value: null
  })
}
