# Graph Report - client  (2026-10-17)

## Corpus Check
- 173 files · ~337,564 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1299 nodes · 1921 edges · 108 communities (87 shown, 21 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `91fb4b5b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dependencies
- admin/types/index.type.ts
- PracticeMegaMenu.vue
- ArticleDS
- TService
- TBanner
- GuideDS
- InquiryDS
- CatalogItemModel
- BaseStore
- default.vue
- BaseApp
- admins.vue
- articles/index.vue
- articles.vue
- banners.vue
- catalog.vue
- services.vue
- guides.vue
- AdminMediaField.vue
- BannerSlider.vue
- reports.vue
- ContactForm.vue
- AdminSelect.vue
- PromiseDS
- admin.vue
- modules/index.ts
- history.vue
- login.vue
- ArticlesPreview.vue
- inquiries.vue
- error.vue
- promises.vue
- ContactSection.vue
- PromisesSection.vue
- CatalogGallery.vue
- admin/index.vue
- AdminLineChart.vue
- useAdminConfirm.ts
- AdminProfileModal.vue
- page-meta.ts
- SiteGuidesFaq.vue
- articles/[slug].vue
- catalog/[slug].vue
- practice-areas/[slug].vue
- guides/index.vue
- Nuxt Minimal Starter
- urls.ts
- AdminThumb.vue
- BaseController
- ServicesSection.vue
- catalog/index.vue
- practice-areas/index.vue
- AdminBarChart.vue
- AdminConfirmModal.vue
- AdminUserBadge.vue
- SiteFooter.vue
- SiteReveal.vue
- usePageSeo.ts
- tsconfig.json
- common.ts
- AdminCheckbox.vue
- AdminHeader.vue
- AdminModal.vue
- AboutSection.vue
- CasePathSection.vue
- StatsStrip.vue
- about-profile.ts
- site-contact.ts
- consultation.vue
- SiteTypeText.vue
- StatDS
- ScrollProgress.vue
- TestimonialDS
- FaqDS
- ProcessStepDS
- faqs.vue
- process-steps.vue
- stats.vue
- testimonials.vue
- FaqSection.vue
- TestimonialsSection.vue
- CatalogPreview.vue
- appointment-slots.vue
- useAdminPageHeader.ts
- appointment-bookings.vue
- jalali.ts
- guides/[slug].vue
- GuidesPreview.vue

## God Nodes (most connected - your core abstractions)
1. `ArticleDS` - 24 edges
2. `TService` - 23 edges
3. `TBanner` - 21 edges
4. `AdminApiService` - 20 edges
5. `BannerDS` - 19 edges
6. `ServiceDS` - 19 edges
7. `CatalogItemModel` - 18 edges
8. `CatalogDS` - 17 edges
9. `GuideDS` - 17 edges
10. `InquiryDS` - 17 edges

## Surprising Connections (you probably didn't know these)
- `BannerState` --references--> `BannerModel`  [EXTRACTED]
  app/modules/banner/data/index.store.ts → app/modules/banner/models/index.model.ts
- `CatalogState` --references--> `CatalogItemModel`  [EXTRACTED]
  app/modules/catalog/data/index.store.ts → app/modules/catalog/models/index.model.ts
- `FaqState` --references--> `FaqModel`  [EXTRACTED]
  app/modules/faq/data/index.store.ts → app/modules/faq/models/index.model.ts
- `GuideState` --references--> `GuideModel`  [EXTRACTED]
  app/modules/guide/data/index.store.ts → app/modules/guide/models/index.model.ts
- `InquiryState` --references--> `InquiryModel`  [EXTRACTED]
  app/modules/inquiry/data/index.store.ts → app/modules/inquiry/models/index.model.ts

## Import Cycles
- None detected.

## Communities (108 total, 21 thin omitted)

### Community 0 - "dependencies"
Cohesion: 0.07
Nodes (26): @fontsource-variable/vazirmatn, dependencies, @fontsource-variable/vazirmatn, nuxt, @nuxtjs/seo, tailwindcss, @tailwindcss/vite, vue (+18 more)

### Community 1 - "admin/types/index.type.ts"
Cohesion: 0.06
Nodes (29): AdminController, AdminDS, AdminState, AdminApiService, ACTION_ICONS, ACTION_LABELS, ADMIN_MODULES, AdminModuleKey (+21 more)

### Community 2 - "PracticeMegaMenu.vue"
Cohesion: 0.05
Nodes (27): emit, mediaSrc, NavLink, practiceHasMore, practiceOpen, props, route, catalogCount (+19 more)

### Community 3 - "ArticleDS"
Cohesion: 0.08
Nodes (12): ArticleController, ArticleDS, ArticleState, ArticleModel, normalizeOrder(), ArticleApiService, TArticle, TArticleCategory (+4 more)

### Community 4 - "TService"
Cohesion: 0.08
Nodes (12): ServiceController, ServiceDS, ServiceState, normalizeOrder(), ServiceModel, ServiceApiService, TCreateServicePayload, TService (+4 more)

### Community 5 - "TBanner"
Cohesion: 0.09
Nodes (10): BannerController, BannerDS, BannerState, BannerModel, normalizeOrder(), BannerService, TBanner, TBannerListQuery (+2 more)

### Community 6 - "GuideDS"
Cohesion: 0.11
Nodes (7): GuideController, GuideDS, GuideState, GuideModel, normalizeOrder(), GuideApiService, TGuide

### Community 7 - "InquiryDS"
Cohesion: 0.09
Nodes (14): InquiryController, InquiryDS, InquiryState, InquiryModule, InquiryModel, CreateInquiryInput, createInquirySchema, flattenInquiryErrors() (+6 more)

### Community 8 - "CatalogItemModel"
Cohesion: 0.09
Nodes (9): CatalogController, CatalogDS, CatalogState, CatalogItemModel, normalizeOrder(), CatalogApiService, TCatalogGalleryImage, TCatalogItem (+1 more)

### Community 9 - "BaseStore"
Cohesion: 0.11
Nodes (4): BaseModule, BaseStore, ModuleRegistry, StoreManager

### Community 16 - "BaseApp"
Cohesion: 0.16
Nodes (3): BaseApp, HttpMethod, RequestErrorShape

### Community 17 - "admins.vue"
Cohesion: 0.14
Nodes (12): { confirm: confirmDelete }, editing, error, form, hasAction(), items, load(), modal (+4 more)

### Community 18 - "articles/index.vue"
Cohesion: 0.11
Nodes (14): allCount, categories, category, gridItems, items, lead, loading, mediaSrc (+6 more)

### Community 19 - "articles.vue"
Cohesion: 0.16
Nodes (11): { confirm: confirmDelete }, editing, error, form, items, load(), modal, payload() (+3 more)

### Community 20 - "banners.vue"
Cohesion: 0.16
Nodes (11): { confirm: confirmDelete }, editing, error, form, items, load(), modal, payload() (+3 more)

### Community 21 - "catalog.vue"
Cohesion: 0.16
Nodes (11): { confirm: confirmDelete }, editing, error, form, items, load(), modal, payload() (+3 more)

### Community 22 - "services.vue"
Cohesion: 0.16
Nodes (11): { confirm: confirmDelete }, editing, error, form, items, load(), modal, payload() (+3 more)

### Community 23 - "guides.vue"
Cohesion: 0.16
Nodes (12): { confirm: confirmDelete }, editing, error, form, items, load(), modal, payload() (+4 more)

### Community 24 - "AdminMediaField.vue"
Cohesion: 0.17
Nodes (9): error, input, isImage, isPdf, mediaSrc, model, preview, props (+1 more)

### Community 25 - "BannerSlider.vue"
Cohesion: 0.21
Nodes (11): active, activeIndex, goTo(), isHovered, loading, mediaSrc, next(), prev() (+3 more)

### Community 26 - "reports.vue"
Cohesion: 0.18
Nodes (7): change, data, error, kpis, loading, range, rangeOptions

### Community 27 - "ContactForm.vue"
Cohesion: 0.20
Nodes (6): error, fieldErrors, form, props, submitting, success

### Community 28 - "AdminSelect.vue"
Cohesion: 0.22
Nodes (6): AdminSelectOption, model, open, props, root, selected

### Community 29 - "PromiseDS"
Cohesion: 0.11
Nodes (8): PromiseController, PromiseDS, PromiseState, PromiseModule, normalizeOrder(), PromiseModel, PromiseApiService, TPromise

### Community 30 - "admin.vue"
Cohesion: 0.11
Nodes (14): accessChips, canCreate, canEdit, groupedLinks, groupLabels, links, nowLabel, open (+6 more)

### Community 31 - "modules/index.ts"
Cohesion: 0.05
Nodes (19): AdminModule, ArticleModule, BannerModule, CatalogModule, GuideModule, adminModule, AppModules, articleModule (+11 more)

### Community 32 - "history.vue"
Cohesion: 0.25
Nodes (6): error, items, moduleFilter, modules, page, pageCount

### Community 33 - "login.vue"
Cohesion: 0.25
Nodes (6): error, loading, password, points, showPassword, username

### Community 34 - "ArticlesPreview.vue"
Cohesion: 0.29
Nodes (6): categories, items, lead, loading, mediaSrc, rest

### Community 35 - "inquiries.vue"
Cohesion: 0.33
Nodes (5): { confirm: confirmDelete }, error, items, load(), remove()

### Community 36 - "error.vue"
Cohesion: 0.33
Nodes (4): description, error, is404, title

### Community 38 - "promises.vue"
Cohesion: 0.16
Nodes (11): { confirm: confirmDelete }, editing, error, form, items, load(), modal, payload() (+3 more)

### Community 39 - "ContactSection.vue"
Cohesion: 0.40
Nodes (4): channels, mapLink, mapSrc, tips

### Community 41 - "CatalogGallery.vue"
Cohesion: 0.20
Nodes (8): active, activeImage, close(), mediaSrc, onKey(), prev(), props, slideDir

### Community 42 - "admin/index.vue"
Cohesion: 0.33
Nodes (4): data, error, kpis, user

### Community 43 - "AdminLineChart.vue"
Cohesion: 0.40
Nodes (4): area, line, points, props

### Community 44 - "useAdminConfirm.ts"
Cohesion: 0.40
Nodes (3): AdminConfirmOptions, AdminConfirmState, defaults

### Community 45 - "AdminProfileModal.vue"
Cohesion: 0.29
Nodes (6): emit, initials, onKey(), permissionRows, props, roleLabel

### Community 46 - "page-meta.ts"
Cohesion: 0.33
Nodes (4): ADMIN_PAGE_META, AdminPageGroup, AdminPageMeta, GROUP_LABELS

### Community 48 - "articles/[slug].vue"
Cohesion: 0.33
Nodes (5): article, mediaSrc, related, route, slug

### Community 49 - "catalog/[slug].vue"
Cohesion: 0.22
Nodes (8): item, mediaSrc, paraMotion, related, route, shell, slug, toc

### Community 50 - "practice-areas/[slug].vue"
Cohesion: 0.33
Nodes (5): mediaSrc, related, route, service, slug

### Community 51 - "guides/index.vue"
Cohesion: 0.22
Nodes (8): activeCategory, categories, filtered, items, lead, loading, mediaSrc, rest

### Community 52 - "Nuxt Minimal Starter"
Cohesion: 0.40
Nodes (4): Development Server, Nuxt Minimal Starter, Production, Setup

### Community 53 - "urls.ts"
Cohesion: 0.60
Nodes (4): asList(), fetchArticles(), fetchList(), SlugItem

### Community 54 - "AdminThumb.vue"
Cohesion: 0.50
Nodes (3): mediaSrc, props, url

### Community 56 - "ServicesSection.vue"
Cohesion: 0.33
Nodes (5): items, lead, loading, mediaSrc, rest

### Community 57 - "catalog/index.vue"
Cohesion: 0.33
Nodes (5): items, lead, loading, mediaSrc, rest

### Community 58 - "practice-areas/index.vue"
Cohesion: 0.33
Nodes (5): items, lead, loading, mediaSrc, rest

### Community 61 - "AdminUserBadge.vue"
Cohesion: 0.40
Nodes (4): emit, initials, props, roleLabel

### Community 63 - "SiteReveal.vue"
Cohesion: 0.40
Nodes (3): RevealVariant, root, shown

### Community 68 - "AdminHeader.vue"
Cohesion: 0.50
Nodes (3): emit, props, { setAction, clearAction }

### Community 70 - "AboutSection.vue"
Cohesion: 0.50
Nodes (3): focusAreas, pillars, roleParts

### Community 84 - "consultation.vue"
Cohesion: 0.10
Nodes (17): api, AvailableDate, AvailableSlot, booking, bookSchema, dates, error, fieldErrors (+9 more)

### Community 86 - "SiteTypeText.vue"
Cohesion: 0.32
Nodes (7): clear(), done, props, root, shown, start(), typeAll()

### Community 89 - "StatDS"
Cohesion: 0.10
Nodes (8): StatController, StatDS, StatState, StatModule, normalizeOrder(), StatModel, StatApiService, TStat

### Community 90 - "ScrollProgress.vue"
Cohesion: 0.50
Nodes (4): onScroll(), progress, updateProgress(), visible

### Community 91 - "TestimonialDS"
Cohesion: 0.10
Nodes (8): TestimonialController, TestimonialDS, TestimonialState, TestimonialModule, normalizeOrder(), TestimonialModel, TestimonialApiService, TTestimonial

### Community 92 - "FaqDS"
Cohesion: 0.11
Nodes (8): FaqController, FaqDS, FaqState, FaqModule, FaqModel, normalizeOrder(), FaqApiService, TFaq

### Community 93 - "ProcessStepDS"
Cohesion: 0.11
Nodes (8): ProcessStepController, ProcessStepDS, ProcessStepState, ProcessStepModule, normalizeOrder(), ProcessStepModel, ProcessStepApiService, TProcessStep

### Community 94 - "faqs.vue"
Cohesion: 0.16
Nodes (11): { confirm: confirmDelete }, editing, error, form, items, load(), modal, payload() (+3 more)

### Community 95 - "process-steps.vue"
Cohesion: 0.16
Nodes (11): { confirm: confirmDelete }, editing, error, form, items, load(), modal, payload() (+3 more)

### Community 96 - "stats.vue"
Cohesion: 0.16
Nodes (11): { confirm: confirmDelete }, editing, error, form, items, load(), modal, payload() (+3 more)

### Community 97 - "testimonials.vue"
Cohesion: 0.16
Nodes (11): { confirm: confirmDelete }, editing, error, form, items, load(), modal, payload() (+3 more)

### Community 99 - "TestimonialsSection.vue"
Cohesion: 0.40
Nodes (4): items, lead, mediaSrc, rest

### Community 101 - "appointment-slots.vue"
Cohesion: 0.13
Nodes (17): addDraft(), addPreset(), can(), { confirm: confirmDelete }, draftRanges, error, filterDate, form (+9 more)

### Community 104 - "appointment-bookings.vue"
Cohesion: 0.20
Nodes (8): BookingRow, cancelBooking(), { confirm: confirmDelete }, error, filtered, items, load(), query

### Community 107 - "guides/[slug].vue"
Cohesion: 0.40
Nodes (4): item, mediaSrc, route, slug

## Knowledge Gaps
- **391 isolated node(s):** `RevealVariant`, `root`, `shown`, `props`, `root` (+386 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ModuleRegistry` connect `BaseStore` to `modules/index.ts`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Why does `BannerDS` connect `TBanner` to `modules/index.ts`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **What connects `RevealVariant`, `root`, `shown` to the rest of the system?**
  _391 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._
- **Should `admin/types/index.type.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05627545353572751 - nodes in this community are weakly interconnected._
- **Should `PracticeMegaMenu.vue` be split into smaller, more focused modules?**
  _Cohesion score 0.05365853658536585 - nodes in this community are weakly interconnected._
- **Should `ArticleDS` be split into smaller, more focused modules?**
  _Cohesion score 0.07743496672716274 - nodes in this community are weakly interconnected._