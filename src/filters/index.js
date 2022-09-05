import dayjs from 'dayjs'

export const formatDate = (value, str = 'YYYY~MM~DD') => {
  return dayjs(value).format(str)
}
