import type { FormInstance } from 'antd';
import { z, type ZodError, type ZodIssue } from 'zod';
import { zhCN } from 'zod/v4/locales';

z.config(zhCN());

export type ZodFieldLabels = Readonly<Record<string, string>>;

function getFieldLabel(path: Array<string | number>, labels: ZodFieldLabels) {
  const exactPath = path.join('.');
  const wildcardPath = path
    .map((segment) => (typeof segment === 'number' ? '*' : segment))
    .join('.');
  const field = path.at(-1);

  return (
    labels[exactPath] ??
    labels[wildcardPath] ??
    (typeof field === 'string' ? labels[field] : undefined)
  );
}

function formatZodIssue(issue: ZodIssue, label?: string) {
  if (!label) return issue.message;

  switch (issue.code) {
    case 'invalid_type':
      return `请输入${label}`;
    case 'invalid_value':
      return `${label}选项无效`;
    case 'invalid_format':
      return `${label}格式不正确`;
    case 'not_multiple_of':
      return `${label}必须是 ${issue.divisor} 的倍数`;
    case 'too_big':
      if (issue.exact) return `${label}必须为 ${issue.maximum}`;
      if (issue.origin === 'string') {
        return `${label}不能超过 ${issue.maximum} 个字符`;
      }
      if (issue.origin === 'array' || issue.origin === 'set') {
        return `${label}不能超过 ${issue.maximum} 项`;
      }
      return issue.inclusive
        ? `${label}不能大于 ${issue.maximum}`
        : `${label}必须小于 ${issue.maximum}`;
    case 'too_small':
      if (issue.origin === 'string' && issue.minimum === 1) {
        return `请输入${label}`;
      }
      if (issue.exact) return `${label}必须为 ${issue.minimum}`;
      if (issue.origin === 'string') {
        return `${label}不能少于 ${issue.minimum} 个字符`;
      }
      if (issue.origin === 'array' || issue.origin === 'set') {
        return `${label}不能少于 ${issue.minimum} 项`;
      }
      return issue.inclusive
        ? `${label}不能小于 ${issue.minimum}`
        : `${label}必须大于 ${issue.minimum}`;
    default:
      return issue.message;
  }
}

export function zodErrorToFormFields(
  error: ZodError,
  labels: ZodFieldLabels = {},
): Parameters<FormInstance['setFields']>[0] {
  return error.issues.map((issue) => {
    const name = issue.path.filter(
      (segment): segment is string | number =>
        typeof segment === 'string' || typeof segment === 'number',
    );

    return {
      name,
      errors: [formatZodIssue(issue, getFieldLabel(name, labels))],
    };
  });
}
