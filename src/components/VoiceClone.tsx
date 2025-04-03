import React, { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { useStore } from "@nanostores/react"
import { $customModel } from "@/lib/store/store.ts"
import { blobData, cn } from "@/lib/utils.ts"
import {
  FileBox,
  Hand,
  LaptopMinimalCheck,
  ListRestart,
  Loader,
  MousePointerClick,
} from "lucide-react"
import { Button } from "@/components/ui/button.tsx"
import { Textarea } from "@/components/ui/textarea.tsx"
import { BASE_URL } from "@/lib/constant.ts"

function VoiceGenerate() {
  const modelStorage = useStore($customModel)

  const [input, setInput] = useState("")
  const [progress, setProgress] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [customModel, setCustomModel] = useState("")
  const [loading, setLoading] = useState(false)
  const [audioURL, setAudioURL] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setCustomModel(modelStorage)
  }, [modelStorage])

  function onDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    setDragging(false)
  }

  function onDragEnter(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    setDragging(true)
  }

  function onDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
  }

  async function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    setDragging(false)

    if (
      e.dataTransfer.files.length > 1 ||
      e.dataTransfer.items[0].webkitGetAsEntry()?.isDirectory
    ) {
      toast.error("只能上传单个文件")
      return
    }

    const file = e.dataTransfer.files[0]
    const formData = new FormData()
    formData.append("voice", file)
    uploadFiles(formData, file.name)
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault()
    e.stopPropagation()

    const files = e.currentTarget.files
    if (!files || !files.length) {
      return
    }
    if (files.length > 1) {
      toast.error("只能上传单个文件")
      return
    }
    const formData = new FormData()
    formData.append("voice", files[0])
    uploadFiles(formData, files[0].name)
  }

  function onUploadClick() {
    fileRef.current?.click()
  }

  function uploadFiles(formData: FormData, filename: string) {
    const xhr = new XMLHttpRequest()
    xhr.open("POST", BASE_URL + "/upload")

    xhr.upload.onprogress = function (e) {
      if (!e.lengthComputable) {
        return
      }
      setProgress((e.loaded / e.total) * 100)
    }

    xhr.onerror = function (e: any) {
      toast.error(e.message ?? e)
      setProgress(0)
    }

    xhr.onload = function () {
      setProgress(0)
      if (xhr.status === 200) {
        const res = JSON.parse(xhr.response)
        if (res.code !== 0) {
          toast.error(res.message)
          return
        }
        toast.success(`${filename} 上传成功`)
        $customModel.set(res.data.id)

        if (fileRef.current) {
          fileRef.current.value = ""
        }
        return
      }
      try {
        toast.error(JSON.parse(xhr.response).message)
      } catch {
        toast.error(`status code: ${xhr.status}`)
      }
    }

    xhr.send(formData)
  }

  function onGenerate() {
    if (loading) {
      return
    }
    const value = input.trim()
    if (!value) {
      toast.error("请输入要生成的文本")
      return
    }
    setAudioURL("")
    setLoading(true)
    fetch(BASE_URL + "/generate", {
      method: "POST",
      body: JSON.stringify({
        content: value,
        model_type: customModel,
        method: "custom",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => blobData(res))
      .then((blob) => setAudioURL(URL.createObjectURL(blob)))
      .catch((err) => toast.error(err.message ?? err))
      .finally(() => setLoading(false))
  }

  return (
    <div className="bg-background/50 rounded-sm border border-dashed backdrop-blur-sm">
      <div className="space-y-4 p-4">
        <div className="border-ring border-l-6 border-l-blue-400 px-1">
          上传文件生成模型
          <span className="text-muted-foreground ml-2 align-bottom text-sm">
            仅支持 m4a / wav 格式文件
          </span>
        </div>
        {customModel ? (
          <div className="border-ring/80 flex flex-wrap items-center gap-2 rounded-sm border border-dashed p-3">
            <div className="flex items-center gap-1">
              <LaptopMinimalCheck size={20} />
              <span>声音模型已生成</span>
            </div>
            <div className="bg-border flex items-center gap-1 rounded-sm px-2 py-1 font-semibold">
              <FileBox size={20} />
              {customModel}
            </div>
            <Button size="sm" onClick={() => $customModel.set("")}>
              <ListRestart />
              重新生成
            </Button>
          </div>
        ) : (
          <div
            onClick={onUploadClick}
            onDragLeave={onDragLeave}
            onDragEnter={onDragEnter}
            onDragOver={onDragOver}
            onDrop={onDrop}
            className={cn(
              "text-muted-foreground border-ring/80 relative flex h-20 items-center justify-center overflow-hidden rounded-sm border border-dashed transition-colors hover:cursor-pointer",
              dragging && "text-foreground border-2"
            )}
          >
            {progress ? (
              <Loader className="mr-1 animate-spin" size={18} />
            ) : dragging ? (
              <Hand className="mr-1" size={20} />
            ) : (
              <MousePointerClick className="mr-1" size={20} />
            )}
            {progress
              ? `${progress.toFixed(2)}%`
              : dragging
                ? "松手即开始上传"
                : "点击或拖拽上传"}
            <input
              multiple
              type="file"
              ref={fileRef}
              className="hidden"
              accept=".m4a,.wav"
              onChange={onFileChange}
            />
            {!!progress && (
              <div
                style={{ width: `${progress}%` }}
                className="text-background absolute -left-0 -z-10 h-full w-full bg-blue-200"
              />
            )}
          </div>
        )}
      </div>
      <div className="space-y-4 border-t border-dashed p-4">
        <div className="border-ring border-l-6 border-l-blue-400 px-1">
          语音克隆
          <span className="text-muted-foreground ml-2 align-bottom text-sm">
            生成时间随内容增长
          </span>
        </div>
        <Textarea
          value={input}
          disabled={loading || !customModel}
          onChange={(e) => setInput(e.currentTarget.value)}
          className="h-30 resize-none"
          placeholder="请输入要生成的文本"
        />
        <Button disabled={loading || !customModel} onClick={onGenerate}>
          <MousePointerClick />
          点击生成
        </Button>
        {loading && <Loader className="animate-spin" />}
      </div>
      {audioURL && (
        <div className="border-t border-dashed p-4">
          <audio controls className="w-full">
            <source src={audioURL} type="audio/wav" />
            您的浏览器不支持 audio 元素。
          </audio>
        </div>
      )}
    </div>
  )
}

export default VoiceGenerate
