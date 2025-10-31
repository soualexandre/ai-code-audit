# AI Performance Audit Lab

Este repositório documenta minha pesquisa sobre os gargalos de performance introduzidos por código gerado por IA (LLMs como Gemini, ChatGPT, etc.).

**Objetivo:** Analisar como e por que IAs geram código subótimo e documentar as correções manuais necessárias para torná-lo "pronto para produção".

**Metodologia:**
1.  Usar um "prompt ingênuo" (simulando um dev júnior).
2.  Benchmarkar o código da IA (`k6`, `Lighthouse`).
3.  Identificar o gargalo (`Clinic.js`, `DevTools`).
4.  Refatorar manualmente para alta performance.
5.  Publicar o comparativo.