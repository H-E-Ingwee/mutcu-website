import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import TextStyle from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import CharacterCount from '@tiptap/extension-character-count'
import { useEffect, useCallback, useState } from 'react'
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3, List, ListOrdered,
  Quote, Code, Minus, Undo, Redo, Link as LinkIcon,
  Image as ImageIcon, AlignLeft, AlignCenter, AlignRight,
  Highlighter, RemoveFormatting, ExternalLink
} from 'lucide-react'

// ─── Toolbar Button ────────────────────────────────────────────────────────────
function ToolbarBtn({ onClick, active, disabled, title, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded-lg transition-all text-sm flex items-center justify-center min-w-[30px] ${
        active
          ? 'bg-navy text-white'
          : 'text-gray-600 hover:bg-gray-100 hover:text-navy'
      } ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {children}
    </button>
  )
}

// ─── Toolbar Divider ──────────────────────────────────────────────────────────
function Divider() {
  return <div className="w-px h-5 bg-gray-200 mx-1 flex-shrink-0" />
}

// ─── Main Editor ──────────────────────────────────────────────────────────────
export default function RichTextEditor({ value, onChange, placeholder = 'Write your blog post here...' }) {
  const [linkModal, setLinkModal] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [imageModal, setImageModal] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [imageAlt, setImageAlt] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Underline,
      TextStyle,
      Highlight.configure({ multicolor: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-orange underline cursor-pointer', target: '_blank', rel: 'noopener noreferrer' },
      }),
      Image.configure({
        HTMLAttributes: { class: 'rounded-xl max-w-full my-4 shadow-md' },
      }),
      Placeholder.configure({ placeholder }),
      CharacterCount,
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[320px] px-5 py-4 text-gray-800 leading-relaxed',
      },
    },
  })

  // Sync external value changes (e.g. when editing existing post)
  useEffect(() => {
    if (editor && value !== undefined && editor.getHTML() !== value) {
      editor.commands.setContent(value || '', false)
    }
  }, [value, editor])

  const setLink = useCallback(() => {
    if (!linkUrl.trim()) {
      editor.chain().focus().extendMarkToLink({ href: '' }).unsetLink().run()
      setLinkModal(false)
      return
    }
    const url = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`
    editor.chain().focus().extendMarkToLink({ href: url }).setLink({ href: url }).run()
    setLinkModal(false)
    setLinkUrl('')
  }, [editor, linkUrl])

  const insertImage = useCallback(() => {
    if (!imageUrl.trim()) return
    editor.chain().focus().setImage({ src: imageUrl, alt: imageAlt || '' }).run()
    setImageModal(false)
    setImageUrl('')
    setImageAlt('')
  }, [editor, imageUrl, imageAlt])

  const openLinkModal = () => {
    const prev = editor.getAttributes('link').href || ''
    setLinkUrl(prev)
    setLinkModal(true)
  }

  if (!editor) return null

  const wordCount = editor.storage.characterCount?.words() || 0
  const charCount = editor.storage.characterCount?.characters() || 0

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white focus-within:border-orange focus-within:ring-2 focus-within:ring-orange/20 transition-all">
      {/* ─── Toolbar ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-gray-100 bg-gray-50 sticky top-0 z-10">

        {/* Undo / Redo */}
        <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo (Ctrl+Z)">
          <Undo size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo (Ctrl+Y)">
          <Redo size={14} />
        </ToolbarBtn>

        <Divider />

        {/* Headings */}
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Heading 1">
          <Heading1 size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2">
          <Heading2 size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3">
          <Heading3 size={14} />
        </ToolbarBtn>

        <Divider />

        {/* Text formatting */}
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold (Ctrl+B)">
          <Bold size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic (Ctrl+I)">
          <Italic size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline (Ctrl+U)">
          <UnderlineIcon size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough">
          <Strikethrough size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive('highlight')} title="Highlight">
          <Highlighter size={14} />
        </ToolbarBtn>

        <Divider />

        {/* Alignment */}
        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Align Left">
          <AlignLeft size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Align Center">
          <AlignCenter size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Align Right">
          <AlignRight size={14} />
        </ToolbarBtn>

        <Divider />

        {/* Lists */}
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List">
          <List size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered List">
          <ListOrdered size={14} />
        </ToolbarBtn>

        <Divider />

        {/* Block elements */}
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">
          <Quote size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline Code">
          <Code size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">
          <Minus size={14} />
        </ToolbarBtn>

        <Divider />

        {/* Link */}
        <ToolbarBtn onClick={openLinkModal} active={editor.isActive('link')} title="Insert Link">
          <LinkIcon size={14} />
        </ToolbarBtn>

        {/* Image */}
        <ToolbarBtn onClick={() => setImageModal(true)} title="Insert Image">
          <ImageIcon size={14} />
        </ToolbarBtn>

        <Divider />

        {/* Clear formatting */}
        <ToolbarBtn onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} title="Clear Formatting">
          <RemoveFormatting size={14} />
        </ToolbarBtn>
      </div>

      {/* ─── Editor Content ───────────────────────────────────────────────────── */}
      <EditorContent editor={editor} />

      {/* ─── Status Bar ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100 bg-gray-50 text-xs text-gray-400">
        <div className="flex items-center gap-3">
          {editor.isActive('heading', { level: 1 }) && <span className="badge badge-navy text-xs">H1</span>}
          {editor.isActive('heading', { level: 2 }) && <span className="badge badge-navy text-xs">H2</span>}
          {editor.isActive('heading', { level: 3 }) && <span className="badge badge-navy text-xs">H3</span>}
          {editor.isActive('bold') && <span className="font-bold text-navy">B</span>}
          {editor.isActive('italic') && <span className="italic text-navy">I</span>}
          {editor.isActive('link') && (
            <span className="flex items-center gap-1 text-orange">
              <ExternalLink size={10} />
              {editor.getAttributes('link').href?.substring(0, 30)}...
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span>{wordCount} word{wordCount !== 1 ? 's' : ''}</span>
          <span>{charCount} char{charCount !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* ─── Link Modal ───────────────────────────────────────────────────────── */}
      {linkModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setLinkModal(false)}>
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <h4 className="font-montserrat font-bold text-navy mb-3 flex items-center gap-2">
              <LinkIcon size={16} className="text-orange" /> Insert Link
            </h4>
            <input
              type="url"
              className="form-input mb-3"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={e => setLinkUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && setLink()}
              autoFocus
            />
            <div className="flex gap-2">
              <button onClick={setLink} className="btn-primary flex-1 justify-center btn-sm">
                <LinkIcon size={13} /> Apply Link
              </button>
              {editor.isActive('link') && (
                <button onClick={() => { editor.chain().focus().unsetLink().run(); setLinkModal(false) }}
                  className="btn-outline flex-1 justify-center btn-sm text-red border-red/30">
                  Remove Link
                </button>
              )}
              <button onClick={() => setLinkModal(false)} className="btn-outline btn-sm px-3">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Image Modal ──────────────────────────────────────────────────────── */}
      {imageModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setImageModal(false)}>
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <h4 className="font-montserrat font-bold text-navy mb-3 flex items-center gap-2">
              <ImageIcon size={16} className="text-orange" /> Insert Image
            </h4>
            <div className="space-y-3">
              <div>
                <label className="form-label">Image URL *</label>
                <input type="url" className="form-input" placeholder="https://..." value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)} autoFocus />
              </div>
              <div>
                <label className="form-label">Alt Text (optional)</label>
                <input type="text" className="form-input" placeholder="Image description" value={imageAlt}
                  onChange={e => setImageAlt(e.target.value)} />
              </div>
              {imageUrl && (
                <img src={imageUrl} alt="Preview" className="w-full h-32 object-cover rounded-xl"
                  onError={e => { e.target.style.display = 'none' }} />
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={insertImage} disabled={!imageUrl.trim()} className="btn-primary flex-1 justify-center btn-sm">
                <ImageIcon size={13} /> Insert Image
              </button>
              <button onClick={() => setImageModal(false)} className="btn-outline btn-sm px-3">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}