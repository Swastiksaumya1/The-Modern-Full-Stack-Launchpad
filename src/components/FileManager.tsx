import { useState } from 'react'
import { Folder, File, Image, FileText, Music, Video, ChevronRight, ArrowLeft, Grid, List } from 'lucide-react'

type FileItem = {
  id: string
  name: string
  type: 'folder' | 'file' | 'image' | 'document' | 'music' | 'video'
  size?: string
  modified: string
  children?: FileItem[]
}

const iconMap = {
  folder: Folder,
  file: File,
  image: Image,
  document: FileText,
  music: Music,
  video: Video,
}

const colorMap = {
  folder: 'text-yellow-400',
  file: 'text-gray-400',
  image: 'text-pink-400',
  document: 'text-blue-400',
  music: 'text-green-400',
  video: 'text-purple-400',
}

const mockFiles: FileItem[] = [
  { id: '1', name: 'Documents', type: 'folder', modified: 'Today', children: [
    { id: '1-1', name: 'Resume.pdf', type: 'document', size: '245 KB', modified: 'Yesterday' },
    { id: '1-2', name: 'Notes.txt', type: 'file', size: '12 KB', modified: '2 days ago' },
  ]},
  { id: '2', name: 'Photos', type: 'folder', modified: 'Yesterday', children: [
    { id: '2-1', name: 'Vacation.jpg', type: 'image', size: '2.4 MB', modified: 'Last week' },
    { id: '2-2', name: 'Profile.png', type: 'image', size: '890 KB', modified: 'Last month' },
  ]},
  { id: '3', name: 'Music', type: 'folder', modified: 'Last week', children: [] },
  { id: '4', name: 'Project.zip', type: 'file', size: '15 MB', modified: 'Today' },
  { id: '5', name: 'Presentation.pptx', type: 'document', size: '5.2 MB', modified: 'Yesterday' },
]

export default function FileManager() {
  const [currentPath, setCurrentPath] = useState<string[]>(['Home'])
  const [currentFiles, setCurrentFiles] = useState<FileItem[]>(mockFiles)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selected, setSelected] = useState<string | null>(null)

  const navigateToFolder = (folder: FileItem) => {
    if (folder.type === 'folder' && folder.children) {
      setCurrentPath([...currentPath, folder.name])
      setCurrentFiles(folder.children)
      setSelected(null)
    }
  }

  const goBack = () => {
    if (currentPath.length > 1) {
      setCurrentPath(currentPath.slice(0, -1))
      setCurrentFiles(mockFiles)
      setSelected(null)
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-2">
          <button onClick={goBack} disabled={currentPath.length <= 1} className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center text-sm">
            {currentPath.map((p, i) => (
              <span key={i} className="flex items-center">
                {i > 0 && <ChevronRight size={14} className="mx-1 text-gray-500" />}
                <span className={i === currentPath.length - 1 ? 'text-white' : 'text-gray-400'}>{p}</span>
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white/20' : 'hover:bg-white/10'}`}>
            <Grid size={16} />
          </button>
          <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white/20' : 'hover:bg-white/10'}`}>
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Files */}
      <div className="flex-1 overflow-y-auto p-4">
        {currentFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 animate-fade-in">
            <Folder size={48} className="mb-2 opacity-50" />
            <p>This folder is empty</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-3 gap-3">
            {currentFiles.map((file, i) => {
              const Icon = iconMap[file.type]
              return (
                <div
                  key={file.id}
                  onClick={() => setSelected(file.id)}
                  onDoubleClick={() => navigateToFolder(file)}
                  className={`flex flex-col items-center p-4 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 animate-scale-in ${
                    selected === file.id ? 'bg-indigo-600/30 ring-1 ring-indigo-400' : 'hover:bg-white/10'
                  }`}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <Icon size={40} className={colorMap[file.type]} />
                  <span className="text-xs mt-2 text-center truncate w-full">{file.name}</span>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="space-y-1">
            {currentFiles.map((file, i) => {
              const Icon = iconMap[file.type]
              return (
                <div
                  key={file.id}
                  onClick={() => setSelected(file.id)}
                  onDoubleClick={() => navigateToFolder(file)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all animate-slide-up ${
                    selected === file.id ? 'bg-indigo-600/30' : 'hover:bg-white/10'
                  }`}
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <Icon size={24} className={colorMap[file.type]} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{file.modified}</p>
                  </div>
                  {file.size && <span className="text-xs text-gray-400">{file.size}</span>}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 border-t border-white/10 bg-white/5 text-xs text-gray-400">
        {currentFiles.length} items {selected && '• 1 selected'}
      </div>
    </div>
  )
}

