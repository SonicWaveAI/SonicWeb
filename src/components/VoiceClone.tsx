import React from "react"
import { BicepsFlexed } from "lucide-react"

function VoiceGenerate() {
  return (
    <div className="bg-background/50 rounded-sm border border-dashed backdrop-blur-sm">
      <div className="text-muted-foreground flex items-center gap-1 p-4">
        <BicepsFlexed size={20} />
        <span>正在开发中</span>
      </div>
    </div>
  )
}

export default VoiceGenerate
