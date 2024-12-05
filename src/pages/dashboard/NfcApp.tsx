import React, { useState, useRef } from 'react'

const NFCApp: React.FC = () => {
  const [scanning, setScanning] = useState<boolean>(false)
  const [dialogData, setDialogData] = useState<string | null>(null)

  const scanButtonRef = useRef<HTMLButtonElement>(null)
  const stopScanButtonRef = useRef<HTMLButtonElement>(null)
  const writeButtonRef = useRef<HTMLButtonElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const ageRef = useRef<HTMLInputElement>(null)
  const cityRef = useRef<HTMLInputElement>(null)
  const nfcDialogRef = useRef<HTMLDialogElement>(null)

  let abortController: AbortController | undefined

  const capitalize = (string: string): string =>
    `${string.charAt(0).toUpperCase()}${string.slice(1)}`

  const showTagData = (data: Record<string, string>): void => {
    const body = Object.entries(data)
      .map(([key, value]) => `${capitalize(key)}: ${value}`)
      .join(', ')
    setDialogData(body)
    nfcDialogRef.current?.showModal()
  }

  const readTag = ({
    message,
  }: {
    message: any
  }): (string | Record<string, string>)[] => {
    const { records } = message
    return records.map((record) => {
      const { recordType, encoding, data } = record
      const decoder = new TextDecoder(encoding || 'utf-8')
      const decodedData = decoder.decode(data)

      if (['url', 'text'].includes(recordType)) {
        console.log('data', decodedData)
        return decodedData
      }

      if (recordType === 'mime') {
        const jsonData = JSON.parse(decodedData)
        showTagData(jsonData)
        return jsonData
      }

      return ''
    })
  }

  const scanTag = async (): Promise<void> => {
    if (scanButtonRef.current) scanButtonRef.current.disabled = true
    if (stopScanButtonRef.current) stopScanButtonRef.current.disabled = false

    try {
      const reader = new NDEFReader()
      abortController = new AbortController()

      reader.scan({ signal: abortController.signal })
      setScanning(true)

      reader.addEventListener('reading', (event) => readTag(event))
      reader.addEventListener('readingerror', (error) =>
        console.error('Error reading tag', error)
      )
    } catch (error) {
      console.error('Error scanning tag:', error)
      if (scanButtonRef.current) scanButtonRef.current.disabled = false
      if (stopScanButtonRef.current) stopScanButtonRef.current.disabled = true
      setScanning(false)
    }
  }

  const stopScan = (): void => {
    if (abortController) {
      abortController.abort()
      abortController = undefined
    }
    if (scanButtonRef.current) scanButtonRef.current.disabled = false
    if (stopScanButtonRef.current) stopScanButtonRef.current.disabled = true
    setScanning(false)
  }

  const writeTag = async (): Promise<void> => {
    if (writeButtonRef.current) writeButtonRef.current.disabled = true

    if (scanning) {
      stopScan()
    }

    const encoder = new TextEncoder()
    const data = {
      name: nameRef.current?.value || '',
      age: ageRef.current?.value || '',
      city: cityRef.current?.value || '',
    }

    const records: NDEFWriteOptions['records'] = [
      {
        recordType: 'mime',
        mediaType: 'application/json',
        data: encoder.encode(JSON.stringify(data)),
      },
    ]

    try {
      const reader = new NDEFReader()
      abortController = new AbortController()

      await reader.write({ records }, { overwrite: true })
      setTimeout(() => abortController?.abort(), 3000)
    } catch (error) {
      console.error('Error writing tag', error)
    } finally {
      if (writeButtonRef.current) writeButtonRef.current.disabled = false
    }
  }

  return (
    <div>
      <button ref={scanButtonRef} onClick={scanTag}>
        Scan
      </button>
      <button ref={stopScanButtonRef} onClick={stopScan} disabled>
        Stop Scan
      </button>
      <button ref={writeButtonRef} onClick={writeTag}>
        Write
      </button>

      <input ref={nameRef} placeholder='Name' />
      <input ref={ageRef} placeholder='Age' />
      <input ref={cityRef} placeholder='City' />

      <dialog ref={nfcDialogRef}>
        <p>{dialogData}</p>
        <button onClick={() => nfcDialogRef.current?.close()}>Close</button>
      </dialog>
    </div>
  )
}

export default NFCApp
