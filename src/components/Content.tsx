import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import VoiceGenerate from "@/components/VoiceGenerate.tsx"
import VoiceClone from "@/components/VoiceClone.tsx"

function Content() {
  return (
    <div className="mx-auto mt-10 h-20 w-11/12 max-w-3xl">
      <Tabs defaultValue="generate" className="gap-5">
        <TabsList>
          <TabsTrigger value="generate">AI 语音生成器</TabsTrigger>
          <TabsTrigger value="clone">AI 语音克隆</TabsTrigger>
        </TabsList>
        <TabsContent value="generate">
          <VoiceGenerate />
        </TabsContent>
        <TabsContent value="clone">
          <VoiceClone />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Content
