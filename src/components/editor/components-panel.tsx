"use client";

import * as React from "react";
import { Package, Plus } from "lucide-react";

/**
 * The Components panel — a second w-60 column (next to Layers) toggled by
 * the bottom-left chip, measured from the reference DOM: a header block with
 * the panel title and a small blue "new component" affordance, and the
 * empty state ("No components yet" + guidance line + Package icon).
 *
 * The live app carries no component-feature beyond this surface (creating
 * components isn't implemented there either — the + button is a no-op on
 * the reference). This clone renders the same panel chrome; component
 * authoring is a documented scope cut (PAD §10).
 */
export function ComponentsPanel() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-editor-border p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-medium text-white">Components</h3>
          <button
            type="button"
            aria-label="New component"
            title="New component"
            className="inline-flex h-6 items-center justify-center gap-2 rounded-md bg-blue-600 px-2 text-xs font-medium text-white shadow transition-colors hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
      <div className="editor-scroll flex-1 overflow-y-auto">
        <div className="p-4 text-center">
          <Package className="mx-auto mb-2 h-8 w-8 text-gray-400" aria-hidden />
          <div className="mb-1 text-sm text-gray-400">No components yet</div>
          <div className="text-xs text-gray-500">Create reusable design components</div>
        </div>
      </div>
    </div>
  );
}
