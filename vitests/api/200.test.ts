import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest'

import * as nucleify from 'nucleify'

describe('fileRequests', (): void => {
  const { closeDialog } = nucleify.useNucDialog()
  const requests: nucleify.NucFileRequestsInterface =
    nucleify.fileRequests(closeDialog)
  const mockResponse = [nucleify.mockFile]

  beforeEach((): void => {
    vi.clearAllMocks()
    nucleify.mockGlobalFetch(vi, mockResponse)
  })

  it('getAllFiles', async (): Promise<void> => {
    await requests.getAllFiles()
    expect(
      (globalThis as unknown as { $fetch: Mock }).$fetch
    ).toHaveBeenCalledWith(
      expect.stringContaining('files'),
      expect.objectContaining({ method: 'GET' })
    )
    expect(requests.results.value).toEqual(mockResponse)
  })

  it('storeFile', async (): Promise<void> => {
    await requests.storeFile(nucleify.mockFile)
    expect(
      (globalThis as unknown as { $fetch: Mock }).$fetch
    ).toHaveBeenCalledWith(
      expect.stringContaining('files'),
      expect.objectContaining({ method: 'POST' })
    )
    expect(requests.results.value).toEqual(mockResponse)
  })

  it('editFile', async (): Promise<void> => {
    await requests.editFile(nucleify.mockFile)
    expect(
      (globalThis as unknown as { $fetch: Mock }).$fetch
    ).toHaveBeenCalledWith(
      expect.stringContaining('files'),
      expect.objectContaining({ method: 'PUT' })
    )
    expect(requests.results.value).toEqual(mockResponse)
  })

  it('deleteFile', async (): Promise<void> => {
    await requests.deleteFile(nucleify.mockFile.id ?? 0)
    expect(
      (globalThis as unknown as { $fetch: Mock }).$fetch
    ).toHaveBeenCalledWith(
      expect.stringContaining('files'),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(requests.results.value).toEqual(mockResponse)
  })
})
