# chat-width

Claude Code 데스크톱·웹 앱에서 채팅 영역(내 메시지, Claude 답변, 도구 실행 줄)의 최대 폭을 제한하고 가운데 정렬하는 mod. 기본 폭은 약 720px. 터미널·VS Code·모바일 화면은 바꾸지 않음.

A Claude Code mod that caps the chat column width (default ~720px) and keeps it centered in the desktop and web apps.

## 설치 (Install)

Claude Code 세션의 입력창에서:

```
/plugin install chat-width --marketplace zerokcola-sys/claude-chat-width
```

마켓플레이스 추가 질문에 `y`, 설치 범위는 `user`(모든 세션에 적용) 선택.

셸에서:

```bash
claude plugin install chat-width --marketplace zerokcola-sys/claude-chat-width
```

## 사용법 (Usage)

| 명령어 | 동작 |
| --- | --- |
| `/chat-width` | 현재 폭 확인 |
| `/chat-width 800` | 800px로 변경 (400~2000) |
| `/chat-width reset` | 기본값 720px로 복귀 |
| `/chat-width off` | 폭 제한 해제 |

설정값은 세션이 바뀌어도 유지됨.

## 조정 (Tuning)

`hooks/register.tsx` 맨 위 상수:

- `DEFAULT_PX`: 기본 폭(px)
- `PX_PER_CELL`: px → 글자 칸 환산값 (기본 8.5). 실제 폭이 목표보다 넓게 보이면 올리고, 좁게 보이면 내림

앱은 폭을 글자 칸 단위로 받아서, 남는 폭을 좌우 여백으로 나눠 가운데 정렬하는 방식. 실제 폭은 글꼴에 따라 약간 다를 수 있음.

## License

MIT
