import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { FullRawDataType } from '~/lib/data'

const useData = () => {
  const [data, setData] = useState<FullRawDataType | null>(null)

  const fetchData = async () => {
    const get = await fetch('/api/topcompanies')
    const res = await get.json()
    return res
  }

  // when this func runs, it extracts one level deep
  // on line 32, we recurse to keep extracting
  function flattenCompanies(arr: FullRawDataType): any {
    let result = []
    for (const company of arr) {
      result.push(company)
      company?.subsidiaries?.forEach((sub) => {
        result.push(sub)
      })

      delete company['subsidiaries']
    }

    for (const company of result) {
      if (company?.subsidiaries?.length) {
        return flattenCompanies(result)
      } else {
        continue
      }
    }

    return result
  }

  function flattenSalariesAndCompanies(arr: FullRawDataType) {
    const results: any = []
    for (const company of arr) {
      company?.salaries?.forEach((x) => {
        results.push({ ...x, company: company.company })
      })
    }

    // sort total comp greatest to least
    return results.sort((a, b) => b.total_compensation - a.total_compensation)
  }

  const flatten = useMemo(() => {
    if (data) {
      const flattenedCos = flattenCompanies(data)
      const flattenedFinalRes = flattenSalariesAndCompanies(flattenedCos)
      return flattenedFinalRes
    }
    return []
  }, [data])

  useEffect(() => {
    fetchData().then((res) => setData(res?.data))
  }, [])

  return { data, flatten }
}
const Home: NextPage = () => {
  const { flatten } = useData()
  console.log('flatten', flatten)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center"></main>

      <footer className="flex h-24 w-full items-center justify-center border-t">
        <a
          className="flex items-center justify-center gap-2"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
        </a>
      </footer>
    </div>
  )
}

export default Home
