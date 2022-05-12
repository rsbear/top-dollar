import type { NextApiRequest, NextApiResponse } from 'next'
import rawData from '~/lib/data'

export default function topCompanies(_, res: NextApiResponse<any>) {
  res.status(200).json({ data: rawData })
}
