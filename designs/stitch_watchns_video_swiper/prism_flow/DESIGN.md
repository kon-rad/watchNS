# Design System Specification: Editorial Energy

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Kinetic Campus."** 

We are moving away from the "grid-of-boxes" social media template. Instead, we are building a high-end, editorial-first experience that captures the rhythmic energy of a school community. The design system leverages **intentional asymmetry** and **tonal layering** to create a sense of motion. By overlapping high-impact typography with fluid, rounded containers, we ensure the platform feels less like a utility and more like a curated digital yearbook.

Our objective is to frame user-generated video content as "Featured Stories" rather than "Posts." Every element should feel like it was placed with purpose, using generous white space (breathing room) to let the vibrant primary tones and high-quality video assets take center stage.

---

## 2. Colors: Tonal Depth & The "No-Line" Rule

This system utilizes a sophisticated deep-violet foundation (`#16052a`) to make video content pop, layered with electric highlights to drive engagement.

### The "No-Line" Rule
**Strict Mandate:** Prohibit the use of 1px solid borders for sectioning content. To define boundaries, you must use **background color shifts** or **surface nesting**.
*   **Good:** A `surface_container_low` card sitting on a `surface` background.
*   **Bad:** A white or grey stroke around a container.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of semi-transparent layers. Use the following hierarchy to define depth:
*   **Base:** `surface` (#16052a) - The canvas.
*   **Sectioning:** `surface_container_low` (#1c0832) - For grouping large content blocks.
*   **Interaction:** `surface_container_high` (#2b1345) - For cards or elements that require focus.
*   **Highlight:** `surface_bright` (#391e58) - For active states or modal overlays.

### The "Glass & Gradient" Rule
To elevate "WatchNS" beyond standard UI:
*   **Glassmorphism:** For floating navigation bars and video overlays, use `surface_variant` at 60% opacity with a `24px` backdrop blur.
*   **Signature Gradients:** Use a linear gradient from `primary` (#b89fff) to `primary_dim` (#8254f4) for high-impact CTAs and "Live" indicators to provide a "soulful" glow.

---

## 3. Typography: The Editorial Voice

We use a pairing of **Plus Jakarta Sans** for expressive moments and **Be Vietnam Pro** for functional clarity.

*   **Display (Plus Jakarta Sans):** Use `display-lg` (3.5rem) and `display-md` (2.75rem) for hero moments and school-wide announcements. These should have a tight letter-spacing (-0.02em) to feel punchy.
*   **Headline (Plus Jakarta Sans):** `headline-lg` (2rem) is your primary tool for video titles and community names.
*   **Title & Body (Be Vietnam Pro):** `title-lg` (1.375rem) provides a clean, modern readable anchor for descriptions. `body-md` (0.875rem) is the workhorse for comments and metadata.
*   **Labels:** `label-md` (0.75rem) should always be uppercase with `0.05em` tracking when used for "Trending" or "New" tags.

---

## 4. Elevation & Depth: Tonal Layering

Traditional drop shadows are banned. Depth is achieved through light and material properties.

*   **The Layering Principle:** Stack `surface_container_lowest` (#000000) behind video players to create a "void" that draws the eye, while placing secondary info on `surface_container` (#240e3b) to pull it forward.
*   **Ambient Glows:** Instead of black shadows, use "Ambient Glows" for floating action buttons. Use a 15% opacity version of `surface_tint` (#b89fff) with a `40px` blur to simulate light emitting from the component onto the surface.
*   **The "Ghost Border" Fallback:** If accessibility requires a border (e.g., input focus), use `outline_variant` (#524067) at **20% opacity**. It should be felt, not seen.

---

## 5. Components: Fluidity & Friendly Forms

### Cards & Video Containers
*   **No Dividers:** Never use lines to separate list items. Use a `1.5rem` (md) vertical gap or a subtle shift from `surface` to `surface_container_low`.
*   **Corner Radii:** Videos must use `xl` (3rem) or `lg` (2rem) rounding. This "super-ellipse" feel removes the clinical edge of digital video.

### Buttons (The Energy Drivers)
*   **Primary:** Gradient from `primary` to `primary_container`. Full-rounded (`full`).
*   **Secondary:** Ghost style. No background, `on_surface` text, with a `surface_variant` background appearing only on hover/tap.
*   **Tertiary:** Glassmorphic. `surface_container_high` at 40% opacity with backdrop blur for overlaying on video content.

### Interactive Elements
*   **Chips:** Use `secondary_container` with `on_secondary_container` text. These should be small, high-radius (`full`) pills for tagging school subjects (e.g., #Varsity, #ScienceFair).
*   **Input Fields:** Use `surface_container_highest` with a `none` border. On focus, transition the background to `surface_bright` and add a subtle `primary` glow.
*   **Video Scrubbers:** The track should be `outline_variant` at 30% opacity, with the progress bar using the `tertiary` (#ff97b8) vibrant pink to contrast against the purple/blue theme.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** embrace asymmetry. Align a headline to the left and a "view all" link slightly offset to the right.
*   **Do** use `tertiary` (#ff97b8) for "Energy" moments—likes, sparks, and live notifications.
*   **Do** treat the video player as the "Sun"—everything else on the screen should orbit around it and be visually quieter.

### Don’t:
*   **Don’t** use pure white text on the dark background. Use `on_surface` (#f1dfff) to prevent "halo" eye strain.
*   **Don’t** use 90-degree corners. Everything in this community is "friendly," so stick to the `DEFAULT` (1rem) radius or higher.
*   **Don’t** use standard "Material Design" blue. Our `primary` is electric and curated; stick to the provided HEX tokens exactly.