import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { HtmlHTMLAttributes } from 'react'


const Loading = ({className}:HtmlHTMLAttributes<HTMLElement>) => {
  return (
    <div className={cn('flex items-center justify-center w-full h-full',className)}>
        <Loader2 className='w-8 h-8 animate-spin'/>
    </div>
  )
}

export default Loading