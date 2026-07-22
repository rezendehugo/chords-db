# Auditoria de voicings do cavaquinho

Execute `npm run audit:cavaquinho` para gerar um relatório JSON completo e
reproduzível. Cada shape informa fretes, MIDI, notas tocadas, omissões, notas
adicionais, duplicações e possíveis equivalências.

## Política

- `complete`: contém todas as notas da fórmula e nenhuma nota externa.
- `incomplete`: não contém notas externas e preserva raiz e tons essenciais.
- `additional`: contém ao menos uma nota fora da fórmula e não pode alimentar
  aliases automáticos.
- `invalid`: não contém notas externas, mas omite um tom essencial.

Os shapes publicados explicitamente como `dim` e `dim7` continuam disponíveis,
mas qualquer shape com notas adicionais fica apenas no relatório para revisão.
Ele nunca é reutilizado automaticamente.

## Cobertura do primeiro lote

| Sufixo canônico | Símbolo   | Raízes com shapes reutilizáveis | Situação                                    |
| --------------- | --------- | ------------------------------: | ------------------------------------------- |
| `7sus4`         | `7(4)`    |                           12/12 | Já existente e validado                     |
| `69`            | `6/9`     |                           12/12 | Derivado conforme tons essenciais aprovados |
| `aug`           | `+`       |                            0/12 | Aguarda shapes com fonte conhecida          |
| `m9`            | `m9`      |                            0/12 | Aguarda shapes com fonte conhecida          |
| `maj9`          | `7M(9)`   |                            0/12 | Aguarda shapes com fonte conhecida          |
| `madd9`         | `m(add9)` |                            0/12 | Aguarda shapes com fonte conhecida          |

Entradas sem cobertura permanecem definidas no domínio e no metadata, mas não
recebem digitações inventadas. Uma fonte verificável deve ser adicionada antes
de publicar shapes para esses acordes.

## Expansão de cobertura rasa

O reaproveitamento determinístico também compara posições físicas já publicadas
com as notas e tons essenciais de `sus2` e `m7`. A expansão preserva a posição
original quando já pertence ao acorde e acrescenta apenas equivalências sem
notas externas.

- `sus2`: todas as raízes passam a oferecer entre 6 e 7 shapes.
- `m7`: todas as raízes passam a oferecer entre 9 e 13 shapes.
- `7`: Db, Eb, Gb, Ab, Bb e B continuam com apenas 2 shapes porque o corpus não
  contém outra posição compatível. Nenhum shape é renomeado para preencher essa
  lacuna artificialmente.
