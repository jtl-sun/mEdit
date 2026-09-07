; installer.nsh — include via electron-builder's nsis.include

; Remove only the default association value if mEdit still owns it.
; This avoids deleting another application's association during uninstall.
!macro RemoveMEditAssociation EXT
  ReadRegStr $0 HKCU "Software\Classes\${EXT}" ""
  StrCmp $0 "mEdit.Document" 0 +2
    DeleteRegValue HKCU "Software\Classes\${EXT}" ""
!macroend

;======================================================================
; customInstall macro is invoked by electron-builder after files are in $INSTDIR
!macro customInstall
  ; Ask the user if they want to register file associations
  MessageBox MB_YESNO|MB_ICONQUESTION \
  "Do you want to associate Markdown files (.md, .markdown, .mmd, .mdown, .mdtxt, .mdtext, .mdx) with mEdit?" /SD IDNO IDNO SkipAssoc

  ; User clicked YES, perform the registry writes.
  WriteRegStr HKCU "Software\Classes\.md"       "" "mEdit.Document"
  WriteRegStr HKCU "Software\Classes\.markdown" "" "mEdit.Document"
  WriteRegStr HKCU "Software\Classes\.mmd"      "" "mEdit.Document"
  WriteRegStr HKCU "Software\Classes\.mdown"    "" "mEdit.Document"
  WriteRegStr HKCU "Software\Classes\.mdtxt"    "" "mEdit.Document"
  WriteRegStr HKCU "Software\Classes\.mdtext"   "" "mEdit.Document"
  WriteRegStr HKCU "Software\Classes\.mdx"      "" "mEdit.Document"

  WriteRegStr HKCU "Software\Classes\mEdit.Document" \
    "" "mEdit Markdown Document"
  WriteRegExpandStr HKCU "Software\Classes\mEdit.Document\DefaultIcon" \
    "" "$INSTDIR\resources\icons\md.ico,0"
  WriteRegExpandStr HKCU "Software\Classes\mEdit.Document\shell\open\command" \
    "" '"$INSTDIR\mEdit.exe" "%1"'

SkipAssoc:
!macroend

;======================================================================
; customUnInstall macro cleans up on uninstall
!macro customUnInstall
  ; Remove the mEdit-owned ProgID.
  DeleteRegKey HKCU "Software\Classes\mEdit.Document"

  ; Remove extension defaults only while they still point to mEdit.
  !insertmacro RemoveMEditAssociation ".md"
  !insertmacro RemoveMEditAssociation ".markdown"
  !insertmacro RemoveMEditAssociation ".mmd"
  !insertmacro RemoveMEditAssociation ".mdown"
  !insertmacro RemoveMEditAssociation ".mdtxt"
  !insertmacro RemoveMEditAssociation ".mdtext"
  !insertmacro RemoveMEditAssociation ".mdx"

  MessageBox MB_YESNO "Do you want to delete mEdit user settings?" /SD IDNO IDNO SkipRemoval
    SetShellVarContext current
    RMDir /r "$APPDATA\mEdit"
  SkipRemoval:
!macroend
