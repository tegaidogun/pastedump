"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function OpenApiPage() {
  return <SwaggerUI url="/openapi.json" />;
} 