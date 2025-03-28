import React, { useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button.tsx"
import { Textarea } from "@/components/ui/textarea.tsx"
import { BASE_URL } from "@/lib/constant.ts"
import { toast } from "sonner"
import { RotateCw } from "lucide-react"

function VoiceGenerate() {
  const [modelList, setModelList] = useState<string[]>([])
  const [input, setInput] = useState("")
  const [model, setModel] = useState("")
  const [loading, setLoading] = useState(false)
  const [audioURL, setAudioURL] = useState("")

  useEffect(() => {
    fetch(BASE_URL + "/models")
      .then((res) => res.json())
      .then((res) => setModelList(res.models))
      .catch((err) => toast.error(err.message ?? err))
  }, [])

  function onGenerate() {
    if (loading) {
      return
    }
    if (!model) {
      toast.error("请选择音色")
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
      body: JSON.stringify({ content: value, model_type: model }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.blob())
      .then((blob) => setAudioURL(URL.createObjectURL(blob)))
      .catch((err) => toast.error(err.message ?? err))
      .finally(() => setLoading(false))
  }

  return (
    <div className="bg-background/50 flex flex-col rounded-sm border border-dashed backdrop-blur-sm sm:flex-row">
      <div className="flex flex-wrap gap-4 border-b border-dashed p-4 sm:w-fit sm:flex-col sm:border-r">
        <Select onValueChange={setModel} disabled={loading}>
          <SelectTrigger>
            <SelectValue placeholder=" 选择音色" />
          </SelectTrigger>
          <SelectContent>
            {modelList.map((item, i) => (
              <SelectItem key={i} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button disabled={loading} onClick={onGenerate}>
          点击生成
        </Button>
        {loading && <RotateCw className="animate-spin self-center" />}
      </div>
      <div className="flex-1">
        <div className="border-b border-dashed p-4">
          <Textarea
            value={input}
            disabled={loading}
            onChange={(e) => setInput(e.currentTarget.value)}
            className="h-30 resize-none"
            placeholder="请输入要生成的文本"
          />
        </div>
        <div className="p-4">
          {audioURL && (
            <audio controls className="w-full">
              <source src={audioURL} type="audio/wav" />
              您的浏览器不支持 audio 元素。
            </audio>
          )}
        </div>
      </div>
    </div>
  )
}

export default VoiceGenerate
