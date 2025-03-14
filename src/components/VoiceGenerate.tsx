import React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button.tsx"
import { Textarea } from "@/components/ui/textarea.tsx"

function VoiceGenerate() {
  return (
    <div className="bg-background/50 flex flex-col rounded-sm border border-dashed backdrop-blur-sm sm:flex-row">
      <div className="flex flex-wrap gap-4 border-b border-dashed p-4 sm:w-fit sm:flex-col sm:border-r">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="选择语言" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="zh">简体中文</SelectItem>
            <SelectItem value="en">English</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder=" 选择音色" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sun">孙悟空</SelectItem>
            <SelectItem value="guo">郭德纲</SelectItem>
          </SelectContent>
        </Select>
        <Button>点击生成</Button>
      </div>
      <div className="flex-1">
        <div className="border-b border-dashed p-4">
          <Textarea
            className="h-30 resize-none"
            placeholder="请输入要生成的文本"
          />
        </div>
        <div className="p-4">
          <audio controls className="w-full">
            <source
              src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
              type="audio/mpeg"
            />
            您的浏览器不支持 audio 元素。
          </audio>
        </div>
      </div>
    </div>
  )
}

export default VoiceGenerate
